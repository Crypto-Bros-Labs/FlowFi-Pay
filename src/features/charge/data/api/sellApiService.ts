import {
  axiosWithAuthInstance,
  publicAxiosInstance,
} from "../../../../shared/api/axiosService";
import type {
  CrossRampOrderModel,
  DepositOrderModel,
  RecoveryOrderModel,
  WithdrawalOrderModel,
} from "../../../history/data/models/historyModel";
import type {
  CrossQuoteData,
  CrossQuoteResponse,
  CrossRampData,
  CrossRampResponse,
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

  async createCrossRamp(data: CrossRampData): Promise<CrossRampResponse> {
    const response = await axiosWithAuthInstance.post("/flow/cross-ramp", data);
    return response.data.data;
  }

  async getCrossQuote(data: CrossQuoteData): Promise<CrossQuoteResponse> {
    const response = await axiosWithAuthInstance.get(
      `/flow/cross-ramp/quoting/${data.providerUuid}`,
      {
        params: {
          sourceCurrencyUuid: data.sourceCurrencyUuid,
          targetCurrencyUuid: data.targetCurrencyUuid,
          sourceAmount: data.sourceAmount,
          targetAmount: data.targetAmount,
        },
      },
    );
    return response.data.data;
  }

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

  async getCrossRampOrderById(orderId: string): Promise<CrossRampOrderModel> {
    const response = await publicAxiosInstance.get(
      `/transactions/cross-order/${orderId}`,
    );
    return response.data.data as CrossRampOrderModel;
  }

  async getUsdToMxnRate(): Promise<number> {
    const response = await axiosWithAuthInstance.get("/exchange-value/usd/mxn");
    console.log("USD to MXN rate response:", response.data);
    return parseFloat(response.data.data);
  }
}

export const sellApiService = new SellApiService();
