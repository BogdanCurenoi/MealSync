import { Box, Typography } from '@mui/material';
import { calculateDiscountedPrice } from '../utils/priceUtils';

export default function PriceDisplay({ price, discount, size = 'normal' }) {
    const finalPrice = calculateDiscountedPrice(price, discount);
    const isDiscounted = discount > 0;
    const mainSize = size === 'large' ? 'h5' : 'h6';
    const subSize = size === 'large' ? 'body1' : 'body2';

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {isDiscounted && (
                <Typography variant={subSize} sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
                    {price} RON
                </Typography>
            )}
            <Typography variant={mainSize} sx={{ color: 'primary.main', fontWeight: 700 }}>
                {finalPrice} RON
            </Typography>
            {isDiscounted && (
                <Typography variant="caption" sx={{
                    backgroundColor: '#E8F5E9',
                    color: '#2E7D32',
                    fontWeight: 700,
                    px: 1,
                    py: 0.25,
                    borderRadius: '8px'
                }}>
                    -{discount}%
                </Typography>
            )}
        </Box>
    );
}
