import { validate } from 'class-validator';
import { UpdateJobOfferDto } from './update-job-offer.dto';

describe('UpdateJobOfferDto', () => {
  it('accepts a partial job offer payload', async () => {
    const dto = new UpdateJobOfferDto();
    dto.status = 'APPLIED';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('accepts an empty payload', async () => {
    const dto = new UpdateJobOfferDto();

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('rejects an invalid status', async () => {
    const dto = new UpdateJobOfferDto();
    dto.status = 'INVALID_STATUS' as never;

    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).toContain('status');
  });

  it('rejects an empty title when title is provided', async () => {
    const dto = new UpdateJobOfferDto();
    dto.title = '';

    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).toContain('title');
  });
});
