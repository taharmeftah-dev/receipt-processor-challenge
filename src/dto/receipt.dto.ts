import { IsString, IsArray, IsNotEmpty, Matches, IsISO8601, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ItemDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w\s\-]+$/, { message: 'shortDescription can only contain alphanumeric, spaces, and hyphens' })
  shortDescription: string;

  @IsString()
  @Matches(/^\d+\.\d{2}$/, { message: 'price must be a valid decimal format (e.g., 1.25)' })
  price: string;
}

export class ReceiptDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w\s\-&]+$/, { message: 'retailer can only contain alphanumeric, spaces, hyphens, and ampersands' })
  retailer: string;

  @IsISO8601({ strict: true }, { message: 'purchaseDate must be a valid ISO 8601 date (e.g., 2022-01-01)' })
  purchaseDate: string;

  @Matches(/^\d{2}:\d{2}$/, { message: 'purchaseTime must be in HH:mm format (e.g., 13:13)' })
  purchaseTime: string;

  @IsArray({ message: 'items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];

  @IsString()
  @Matches(/^\d+\.\d{2}$/, { message: 'total must be a valid decimal format (e.g., 1.25)' })
  total: string;
}
