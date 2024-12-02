import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ReceiptDto } from 'src/dto/receipt.dto';
import { v4 as uuidv4 } from 'uuid';

@Controller('receipts')
export class ReceiptsController {
    private receipts = new Map<string, { receipt: ReceiptDto; points: number }>();

    @Post('process')
    processReceipt(@Body() receipt: ReceiptDto): { id: string } {
        // Validate and process receipt
        const id = uuidv4();
        const points = this.calculatePoints(receipt);

        // Save receipt and points in memory
        this.receipts.set(id, { receipt, points });

        return { id };
    }

    @Get(':id/points')
    getPoints(@Param('id') id: string): { points: number } {
        const receiptData = this.receipts.get(id);

        if (!receiptData) {
            throw new NotFoundException(`Receipt with ID ${id} not found.`);
        }

        return { points: receiptData.points };
    }

    private calculatePoints(receipt: ReceiptDto): number {
        let points = 0;

        // 1. One point per alphanumeric character in retailer name
        points += (receipt.retailer.match(/\w/g) || []).length;

        // 2. 50 points if total is a round dollar amount
        if (Number(receipt.total) % 1 === 0) points += 50;

        // 3. 25 points if total is a multiple of 0.25
        if (Number(receipt.total) % 0.25 === 0) points += 25;

        // 4. 5 points for every two items
        points += Math.floor(receipt.items.length / 2) * 5;

        // 5. Item description length multiple of 3 => price * 0.2 (rounded up)
        for (const item of receipt.items) {
            const trimmedLength = item.shortDescription.trim().length;
            if (trimmedLength % 3 === 0) {
                points += Math.ceil(Number(item.price) * 0.2);
            }
        }

        // 6. 6 points if purchase day is odd
        const day = new Date(receipt.purchaseDate).getDate();
        if (day % 2 === 1) points += 6;

        // 7. 10 points if time is between 2:00pm and 4:00pm
        const [hour, minute] = receipt.purchaseTime.split(':').map(Number);
        if (hour === 14 || (hour === 15 && minute === 0)) points += 10;

        return points;
    }
}
