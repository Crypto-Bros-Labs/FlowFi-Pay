import sellLocalService, {
  type Amounts,
  type SellData,
} from "../local/sellLocalService";
import { sellApiService } from "../api/sellApiService";
import type {
  OffRampData,
  OffRampResponse,
  OnRampData,
  QuoteData,
  RecoveryOrderData,
} from "../models/sellModel";
import { AxiosError } from "axios";
import type {
  DepositOrderModel,
  RecoveryOrderModel,
  WithdrawalOrderModel,
} from "../../../history/data/models/historyModel";

class SellRepository {
  async createOffRamp(data: OffRampData): Promise<{
    success: boolean;
    kycUrl: string | null;
    status: string | null;
    destinationWalletAddress: string | null;
    transactionId?: string | null;
    orderUuid?: string | null;
  }> {
    try {
      const response = await sellApiService.createOffRamp(data);
      console.log("📨 API Response completa:", response);
      if (response.destinationWalletAddress !== undefined) {
        console.log(
          "🏦 Destination Wallet Address:",
          response.destinationWalletAddress,
        );
        return {
          success: true,
          kycUrl: null,
          status: null,
          destinationWalletAddress: response.destinationWalletAddress,
          transactionId: response.transactionId || null,
          orderUuid: response.orderUuid || null,
        };
      } else if (response.kycStatus === "APPROVED") {
        if (response.successTransfer) {
          return {
            success: true,
            kycUrl: null,
            status: response.kycStatus,
            destinationWalletAddress: null,
          };
        } else {
          return {
            success: false,
            kycUrl: null,
            status: response.kycStatus,
            destinationWalletAddress: null,
          };
        }
      } else {
        return {
          success: false,
          kycUrl: response.kycUrl,
          status: response.kycStatus,
          destinationWalletAddress: null,
        };
      }
    } catch (error) {
      console.error("Failed to create off-ramp:", error);
      // Narrow the AxiosError type to include the expected response shape
      const axiosErr = error as AxiosError<{ data: OffRampResponse }>;
      if (axiosErr.response?.status === 403) {
        const response = axiosErr.response;
        const data = response?.data?.data as OffRampResponse | undefined;
        if (data && data.kycStatus === "APPROVED") {
          if (data.successTransfer) {
            return {
              success: true,
              kycUrl: null,
              status: data.kycStatus,
              destinationWalletAddress: data.destinationWalletAddress || null,
            };
          } else {
            return {
              success: false,
              kycUrl: null,
              status: data.kycStatus,
              destinationWalletAddress: data.destinationWalletAddress || null,
            };
          }
        } else if (data) {
          return {
            success: false,
            kycUrl: data.kycUrl,
            status: data.kycStatus,
            destinationWalletAddress: data.destinationWalletAddress || null,
          };
        } else {
          return {
            success: false,
            kycUrl: null,
            status: null,
            destinationWalletAddress: null,
          };
        }
      } else {
        return {
          success: false,
          kycUrl: null,
          status: null,
          destinationWalletAddress: null,
        };
      }
    }
  }

  async createOnRamp(data: OnRampData): Promise<{
    success: boolean;
    id: string | null;
    clabeNumber: string | null;
    orderUuid?: string | null;
  }> {
    try {
      const response = await sellApiService.createOnRamp(data);
      return {
        success: true,
        id: response.id,
        clabeNumber: response.bankAccountIdentifier,
        orderUuid: response.orderUuid || null,
      };
    } catch (error) {
      console.error("Failed to create on-ramp:", error);
      return { success: false, id: null, clabeNumber: null, orderUuid: null };
    }
  }

  async createRecoveryOrder(
    recoveryOrder: RecoveryOrderData,
  ): Promise<{ success: boolean; orderUuid: string }> {
    try {
      const response = await sellApiService.createRecoveryOrdder(recoveryOrder);
      return { success: response.success, orderUuid: response.orderUuid };
    } catch (error) {
      console.error("Failed to create recovery order:", error);
      return { success: false, orderUuid: "" };
    }
  }

  async getRecoveryOrderById(orderId: string): Promise<RecoveryOrderModel> {
    try {
      const recoveryOrder = await sellApiService.getRecoveryOrderById(orderId);
      return recoveryOrder;
    } catch (error) {
      console.error("Failed to get recovery order by ID:", error);
      throw error;
    }
  }

  async getWithdrawalOrderById(orderId: string): Promise<WithdrawalOrderModel> {
    try {
      const withdrawalOrder =
        await sellApiService.getWithdrawalOrderById(orderId);
      return withdrawalOrder;
    } catch (error) {
      console.error("Failed to get withdrawal order by ID:", error);
      throw error;
    }
  }

  async getDepositOrderById(orderId: string): Promise<DepositOrderModel> {
    try {
      const depositOrder = await sellApiService.getDepositOrderById(orderId);
      return depositOrder;
    } catch (error) {
      console.error("Failed to get deposit order by ID:", error);
      throw error;
    }
  }

  async getQuote(
    data: QuoteData,
  ): Promise<{ success: boolean; cryptoAmount?: string; fiatAmount?: string }> {
    try {
      const response = await sellApiService.getQuote(data);

      const cryptoAmountStr = response.displayCryptoAmount.toString();
      const fiatAmountStr = response.displayFiatAmount.toString();
      sellLocalService.setAmountToken(cryptoAmountStr);
      sellLocalService.setAmountFiat(fiatAmountStr);

      // ✅ Retornar el valor obtenido
      return {
        success: true,
        cryptoAmount: cryptoAmountStr,
        fiatAmount: fiatAmountStr,
      };
    } catch (error) {
      console.error("Failed to get quote:", error);
      return { success: false };
    }
  }

  async getUsdToMxnRate(): Promise<number | null> {
    try {
      const rate = await sellApiService.getUsdToMxnRate();
      return rate;
    } catch (error) {
      console.error("Failed to get USD to MXN rate:", error);
      return null;
    }
  }

  getOffRampData(): OffRampData | null {
    return sellLocalService.getOffRampData();
  }

  setOffRampData(data: OffRampData | null): void {
    sellLocalService.setOffRampData(data);
  }

  getAmounts(): Amounts | null {
    return sellLocalService.getAmounts();
  }

  setAmounts(amounts: Amounts | null): void {
    sellLocalService.setAmounts(amounts);
  }

  getAmountFiat(): string {
    return sellLocalService.getAmountFiat() ?? "0";
  }

  getAmountToken(): string {
    return sellLocalService.getAmountToken() ?? "0";
  }

  setAmountFiat(amountFiat: string): void {
    sellLocalService.setAmountFiat(amountFiat);
  }

  setAmountToken(amountToken: string): void {
    sellLocalService.setAmountToken(amountToken);
  }

  getSellData(): SellData | null {
    return sellLocalService.getSellData();
  }

  setSellData(data: SellData | null): void {
    sellLocalService.setSellData(data);
  }
}

export default new SellRepository();
