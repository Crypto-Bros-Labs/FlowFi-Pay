import React from "react";
import AppHeader from "../../../../shared/components/AppHeader";
import { IoPerson } from "react-icons/io5";
import TileHistory from "../components/TileHistory";

const HistoryPage: React.FC = () => {
    return (
        <div className="flex flex-col h-full">
            <AppHeader
                rightActions={[
                    {
                        icon: IoPerson,
                        onClick: () => console.log('Profile clicked'),
                        className: 'text-gray-700'
                    }
                ]}
            />
            <div className="flex-1 flex px-4 mt-4 overflow-y-auto flex-col gap-4">
                <TileHistory
                    status="completed"
                    amount={1250.50}
                    subtitle="Transferencia SPEI"
                />

                <TileHistory
                    status="pending"
                    amount={500.00}
                    subtitle="Depósito en proceso"
                />

                <TileHistory
                    status="canceled"
                    amount={750.25}
                    subtitle="Transferencia fallida"
                />
            </div>
        </div>
    );
}

export default HistoryPage;