import { useStandStore } from "@/modules/back-office/stands/store/stand.store";

interface SpeakerLabelProps {
    standId: number;
}

export const StandLabel = ({ standId }: SpeakerLabelProps) => {
    const stands = useStandStore(state => state.filtered);
    const stand = stands.find((sp) => sp.id === standId);

    return (
        <span className="text-bold flex flex-col items-start justify-start">
            <span>{stand?.name}</span>
            <span>Pab.: {stand?.pavilion?.nameEs}</span>
        </span>
    );
};