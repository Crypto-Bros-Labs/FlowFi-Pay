import React from 'react';
import { BiChevronRight } from 'react-icons/bi';
import TileApp from '../../../../shared/components/TileApp';

interface TeamTileProps {
    memberCount: number;
    onClick?: () => void;
}

const TeamTile: React.FC<TeamTileProps> = ({ memberCount, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="border border-[#666666] rounded-[10px] bg-white p-2.5 transition-all duration-200 ease-in-out hover:border-gray-400 hover:shadow-sm cursor-pointer"
        >
            <div className="flex items-center justify-between">
                {/* Contenido principal */}
                <div className="flex-1">
                    <TileApp
                        title="Administrar equipo"
                        subtitle={`${memberCount} ${memberCount === 1 ? 'miembro' : 'miembros'}`}
                        titleClassName="text-base font-semibold text-[#020F1E]"
                        subtitleClassName="text-xs font-medium text-[#666666] truncate mt-0.5"
                        leading={
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
                                </svg>
                            </div>
                        }
                        trailing={
                            <BiChevronRight className="w-6 h-6 text-gray-400 ml-2 flex-shrink-0" />
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default TeamTile;