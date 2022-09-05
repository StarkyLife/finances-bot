import { presentSequenceData } from './present-sequence-data';

it('should present sequence data', () => {
  const stepsMap = new Map<string, { label: string }>([
    ['type_id', { label: 'Type' }],
    ['price_id', { label: 'Price' }],
  ]);

  const getSequenceData = jest.fn().mockReturnValue({
    type_id: 'Income',
    price_id: '100',
    comment_id: 'comment'
  });

  const sequencePresentation = presentSequenceData(stepsMap)(getSequenceData);

  expect(sequencePresentation).toEqual([
    { id: 'type_id', label: 'Type', value: 'Income' },
    { id: 'price_id', label: 'Price', value: '100' },
  ]);
});
