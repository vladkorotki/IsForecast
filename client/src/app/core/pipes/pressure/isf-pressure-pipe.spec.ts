import { beforeEach, describe, expect, it } from 'vitest';
import { IsfPressurePipe } from './isf-pressure-pipe';

describe('IsfPressurePipe', () => {
  let pipe: IsfPressurePipe;

  beforeEach(() => {
    pipe = new IsfPressurePipe();
  });

  it('should convert hPa to mmHg by default', () => {
    const result = pipe.transform(1013.25);

    expect(result).toBe('760 mmHg');
  });

  it('should explicitly convert hPa to mmHg when requested', () => {
    const result = pipe.transform(1013.25, 'mmHg');

    expect(result).toBe('760 mmHg');
  });

  it('should return hPa format when hPa is passed', () => {
    const result = pipe.transform(1013.25, 'hPa');

    expect(result).toBe('1013 hPa');
  });

  it('should handle zero correctly', () => {
    expect(pipe.transform(0, 'mmHg')).toBe('0 mmHg');
    expect(pipe.transform(0, 'hPa')).toBe('0 hPa');
  });
});
