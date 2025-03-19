import { Avatar, AvatarFallback, AvatarImage } from "@/components";
import { useSpeakerStore } from "@/modules/back-office/speakers/store/speaker.store";

interface SpeakerLabelProps {
    speakerId: number;
}

export const SpeakerLabel = ({ speakerId }: SpeakerLabelProps) => {
    const speakers = useSpeakerStore(state => state.filtered);
    const speaker = speakers.find((sp) => sp.id === speakerId);

    return (
        <span className="text-bold flex gap-1 items-center justify-start">
            <Avatar className="hidden h-6 w-6 sm:flex">
                <AvatarImage src={speaker?.photoUrl || ''} alt={speaker?.name} />
                <AvatarFallback>{speaker?.name.slice(0,1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Avatar className="hidden h-6 w-6 sm:flex">
                <AvatarImage src={speaker?.country.icon || ''} alt={speaker?.country.name} />
                <AvatarFallback>{speaker?.country?.name?.slice(0,1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{speaker?.name}</span>
        </span>
    );
};