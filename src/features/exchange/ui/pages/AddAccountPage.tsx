import React from "react";
import AddAccountPanel from "../components/AddAccountPanel";

const AddAccountPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] bg-[#F5F7FA] w-full">
            <div className="w-[80%] md:w-130">
                <AddAccountPanel isFlow={true} />
            </div>
        </div>
    );
};

export default AddAccountPage;