import AppHeader from "../../../../shared/components/AppHeader";
import { IoPerson } from "react-icons/io5";
import TileHistory from "../components/TileHistory";
import { useHistory } from "../hooks/useHistory";
import {
  parseTransactionStatus,
  parseTransactionType,
} from "../../../../shared/utils/historyUtils";
import { formatDateRelative } from "../../../../shared/utils/dateUtils";
import { useNavigate } from "react-router-dom";
import SellInfoPanel from "../../../charge/ui/components/SellInfoPanel";
import ModalWrapper from "../../../../shared/components/ModalWrapper";
import ExternalSellInfoPanel from "../../../wallet/ui/components/ExternalSellInfoPanel";
import BuyInfoPanel from "../../../wallet/ui/components/BuyInfoPanel";

// Componente para las tarjetas de estadísticas
const StatCard: React.FC<{
  title: string;
  amountUSD?: number;
  amountMXN?: number;
  count?: number;
  isLoading: boolean;
}> = ({ title, amountUSD, amountMXN, count, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-1 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1">
      <h3 className="text-sm font-medium text-gray-600 mb-3 truncate text-center">
        {title}
      </h3>

      {count !== undefined ? (
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {count.toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            ${amountUSD?.toFixed(2) || "0.00"}
          </div>
          <div className="text-sm text-gray-500">
            $
            {amountMXN?.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            MXN
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para los botones de filtro
const FilterButton: React.FC<{
  label: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`
            px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200
            ${
              isSelected
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
        `}
  >
    {label}
  </button>
);

const HistoryPage: React.FC = () => {
  const {
    history,
    isLoading,
    statistics,
    selectedFilter,
    filterOptions,
    handleFilterChange,
    cancelTransaction,
    showSellInfoModal,
    closeSellModal,
    sellInfoData,
    openSellModal,
    showWithdrawalInfoModal,
    closeWithdrawalModal,
    withdrawalInfoData,
    openWithdrawalModal,
    showDepositInfoModal,
    closeDepositModal,
    depositInfoData,
    openDepositModal,
  } = useHistory();

  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <AppHeader
        onBack={() => navigate("/main")}
        rightActions={[
          {
            icon: IoPerson,
            onClick: () => navigate("/profile"),
            className: "text-gray-700",
          },
        ]}
      />

      {/* Tarjetas de estadísticas */}
      <div className="px-4 mt-4 mb-4">
        <div className="flex gap-3">
          <StatCard
            title="Total de transacciones"
            count={statistics.totalTransactions}
            isLoading={isLoading}
          />
          <StatCard
            title="Total recibido"
            amountUSD={statistics.totalReceivedUSD}
            amountMXN={statistics.totalReceivedMXN}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Sección de filtros */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {filterOptions.map((option) => (
            <FilterButton
              key={option.key}
              label={option.label}
              isSelected={selectedFilter === option.key}
              onClick={() => handleFilterChange(option.key)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex px-4 overflow-y-auto flex-col gap-4">
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Cargando historial...</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sin transacciones
            </h3>
            <p className="text-sm text-gray-500 text-center">
              No hay transacciones para el período seleccionado
            </p>
          </div>
        )}

        {/* History list */}
        {!isLoading &&
          history.length > 0 &&
          history.map((transaction) => {
            return "capaWallet" in transaction ? (
              <TileHistory
                key={transaction.createdAt}
                status={parseTransactionStatus(transaction.status!)}
                amount={Number(transaction.cryptoAmount)}
                id={transaction.transactionId}
                type={parseTransactionType("OFF_RAMP")}
                onCancelTransaction={cancelTransaction}
                subtitle={formatDateRelative(transaction.createdAt)}
                onClick={() =>
                  openWithdrawalModal({
                    amountFiat: transaction.FiatCurrencyAmount,
                    amountToken: transaction.cryptoAmount,
                    tokenSymbol: transaction.TokenSymbol,
                    networkName: transaction.network,
                    orderId: transaction.orderUuid,
                    transactionId: transaction.transactionId,
                    walletAddress: transaction.capaWallet,
                    name: transaction.name,
                    status: parseTransactionStatus(transaction.status!),
                  })
                }
              />
            ) : "capaClabe" in transaction ? (
              <TileHistory
                key={transaction.createdAt}
                status={parseTransactionStatus(transaction.status!)}
                amount={Number(transaction.cryptoAmount)}
                id={transaction.transactionId}
                type={parseTransactionType("ON_RAMP")}
                subtitle={formatDateRelative(transaction.createdAt)}
                onCancelTransaction={cancelTransaction}
                onClick={() => {
                  openDepositModal({
                    amountFiat: transaction.FiatCurrencyAmount,
                    amountToken: transaction.cryptoAmount,
                    tokenSymbol: transaction.TokenSymbol,
                    networkName: transaction.network,
                    orderId: transaction.orderUuid,
                    transactionId: transaction.transactionId,
                    clabe: transaction.capaClabe,
                    name: transaction.name,
                    status: parseTransactionStatus(transaction.status!),
                  });
                }}
              />
            ) : (
              <TileHistory
                key={transaction.createdAt}
                status={parseTransactionStatus(transaction.status!)}
                amount={Number(transaction.cryptoAmount)}
                id={transaction.orderUuid}
                subtitle={formatDateRelative(transaction.createdAt)}
                onClick={() =>
                  openSellModal({
                    amountFiat: transaction.FiatCurrencyAmount,
                    amountToken: transaction.cryptoAmount,
                    tokenSymbol: transaction.TokenSymbol,
                    networkName: transaction.network,
                    orderId: transaction.orderUuid,
                    name: transaction.name,
                  })
                }
              />
            );
          })}
      </div>

      {showSellInfoModal && (
        <ModalWrapper onClose={closeSellModal}>
          <SellInfoPanel
            onClose={closeSellModal}
            onContinue={closeSellModal}
            sellInfoData={sellInfoData}
          />
        </ModalWrapper>
      )}

      {showWithdrawalInfoModal && (
        <ModalWrapper onClose={closeWithdrawalModal}>
          <ExternalSellInfoPanel
            onClose={closeWithdrawalModal}
            onContinue={closeWithdrawalModal}
            withdrawalInfo={withdrawalInfoData}
          />
        </ModalWrapper>
      )}

      {showDepositInfoModal && (
        <ModalWrapper onClose={closeDepositModal}>
          <BuyInfoPanel
            onClose={closeDepositModal}
            onContinue={closeDepositModal}
            buyInfoData={{
              amountFiat: depositInfoData?.amountFiat || "",
              amountToken: depositInfoData?.amountToken || "",
              tokenSymbol: depositInfoData?.tokenSymbol || "",
              networkName: depositInfoData?.networkName || "",
              orderId: depositInfoData?.orderId || "",
              id: depositInfoData?.transactionId || "",
              clabe: depositInfoData?.clabe || "",
              beneficiaryName: depositInfoData?.name || "",
              status: depositInfoData?.status || "pending",
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
};

export default HistoryPage;
