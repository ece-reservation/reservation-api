import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class GetUserReservationsResponse {
  @ApiProperty({
    type: 'number',
    description: 'user의 id입니다.',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: 'json',
    description: 'user의 reservation 목록입니다.',
    example: [
      {
        id: 1,
        date: '2023-02-02',
        table_name: 'table_1',
        times: [8, 9],
      },
      {
        id: 2,
        date: '2023-02-02',
        table_name: 'table_1',
        times: [10, 11],
      },
      {
        id: 3,
        date: '2023-02-02',
        table_name: 'table_1',
        times: [12, 13],
      },
    ],
  })
  reservations: JSON[];
}