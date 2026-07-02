import { validate } from 'class-validator';
import { CreateJobOfferDto } from './create-job-offer.dto';

describe('CreateJobOfferDto', () => {
  it('accepts a valid job offer payload', async () => {
    const dto = new CreateJobOfferDto();
    dto.title = 'Frontend Developer';
    dto.company = 'TaffTaff';
    dto.location = 'Paris';
    dto.salary = '50k';
    dto.url = 'https://example.com/jobs/frontend-developer';
    dto.status = 'SAVED';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('rejects empty required fields', async () => {
    const dto = new CreateJobOfferDto();
    dto.title = '';
    dto.company = '';

    const errors = await validate(dto);
    const fields = errors.map((error) => error.property);

    expect(fields).toEqual(expect.arrayContaining(['title', 'company']));
  });

  it('rejects an invalid url', async () => {
    const dto = new CreateJobOfferDto();
    dto.title = 'Frontend Developer';
    dto.company = 'TaffTaff';
    dto.url = 'not-a-url';

    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).toContain('url');
  });
});
