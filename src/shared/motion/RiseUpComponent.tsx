import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
interface Props {
    children: React.ReactNode;
    className?: string;
}
export function RiseUpComponent({
    children, className
}: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn('', className)}
        >
            {children}
        </motion.div>
    )
}