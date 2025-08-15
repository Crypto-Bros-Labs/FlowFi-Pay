import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface TeamMember {
    id: string;
    name: string;
    status: "active" | "inactive";
}

export const usePeopleOptions = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const handleAddMember = () => {
        navigate("/add-people");
    }

    useEffect(() => {
        const fetchTeamMembers = async () => {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockTeamMembers: TeamMember[] = [
                    { id: "1", name: "Juan Pérez", status: "active" },
                    { id: "2", name: "Ana López", status: "inactive" },
                ];

                setTeamMembers(mockTeamMembers);

            } catch (error) {
                console.error("Error fetching team members:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeamMembers();
    }, []);

    return {
        teamMembers,
        teamMembersLoading: isLoading,
        handleAddMember,
    };
};
