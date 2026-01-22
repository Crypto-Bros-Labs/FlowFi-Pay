import {
  axiosWithAuthInstance,
  publicAxiosInstance,
} from "../../../../shared/api/axiosService";
import type {
  DepositOrderModel,
  RecoveryOrderModel,
  WithdrawalOrderModel,
} from "../../../history/data/models/historyModel";
import type {
  OffRampData,
  OffRampResponse,
  OnRampData,
  OnRampResponse,
  QuoteData,
  QuoteResponse,
  RecoveryOrderData,
} from "../models/sellModel";

class SellApiService {
  async createOffRamp(data: OffRampData): Promise<OffRampResponse> {
    const response = await axiosWithAuthInstance.post("/flow/off-ramp", data);
    return response.data.data;
  }

  async createOnRamp(data: OnRampData): Promise<OnRampResponse> {
    const response = await axiosWithAuthInstance.post("/flow/on-ramp", data);
    return response.data.data;
  }

  /*async getQuote(data: QuoteData): Promise<QuoteResponse> {
        const response = await axiosWithAuthInstance.get(`/flow/off-ramp/quoting/${data.providerUuid}`, {
            params: {
                from: data.fromUuuid,
                to: data.toUuid,
                amount: data.amountFiat
                
            }
        });
        return response.data.data;
    }*/

  async getQuote(data: QuoteData): Promise<QuoteResponse> {
    const response = await axiosWithAuthInstance.get(
      `/flow/quoting/${data.providerUuid}`,
      {
        params: {
          from: data.fromUuuid,
          to: data.toUuid,
          amount: data.amountFiat,
          type: data.type,
          isCryptoResponse: data.isCryptoResponse,
        },
      },
    );
    return response.data.data;
  }

  async createRecoveryOrdder(
    recoveryOrder: RecoveryOrderData,
  ): Promise<{ success: boolean; orderUuid: string }> {
    const response = await axiosWithAuthInstance.post(
      "/transactions/charging-order",
      recoveryOrder,
    );
    return { success: response.data.success, orderUuid: response.data.data };
  }

  async getRecoveryOrderById(orderId: string): Promise<RecoveryOrderModel> {
    const response = await publicAxiosInstance.get(
      `/transactions/charging-order/${orderId}`,
    );
    return response.data.data as RecoveryOrderModel;
  }

  async getWithdrawalOrderById(orderId: string): Promise<WithdrawalOrderModel> {
    const response = await publicAxiosInstance.get(
      `/transactions/withdrawal-order/${orderId}`,
    );
    return response.data.data as WithdrawalOrderModel;
  }

  async getDepositOrderById(orderId: string): Promise<DepositOrderModel> {
    const response = await publicAxiosInstance.get(
      `/transactions/deposit-order/${orderId}`,
    );
    return response.data.data as DepositOrderModel;
  }

  async getUsdToMxnRate(): Promise<number> {
    const response = await axiosWithAuthInstance.get("/exchange-value/usd/mxn");
    console.log("USD to MXN rate response:", response.data);
    return parseFloat(response.data.data);
  }
}

export const sellApiService = new SellApiService();
