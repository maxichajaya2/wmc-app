import { useSpeakerStore } from '../../store/speaker.store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components';

interface CountryItemProps {
    countryCode: string;
}
export const CountryItem = ({ countryCode }: CountryItemProps) => {
    const countries = useSpeakerStore(state => state.countries);
    return (
        <span className="text-bold flex gap-1">
            <Avatar className="hidden h-6 w-6 sm:flex">
                <AvatarImage src={countries.find((c) => c.code === countryCode)?.icon} alt={countries.find((c) => c.code === countryCode)?.name} />
                <AvatarFallback>{countryCode.toUpperCase()}</AvatarFallback>
            </Avatar>
            {countries.find((c) => c.code === countryCode)?.name}
        </span>
    )
}
