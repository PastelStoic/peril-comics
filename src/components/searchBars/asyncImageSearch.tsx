import AsyncSelect from 'react-select/async';
import type { SingleValue } from 'react-select/dist/declarations/src';

const images = [
  {
    label: "Tifa Base",
    value: "imageid1",
  },
  {
    label: "Tifa Clothing",
    value: "imageid2",
  },
];

export type Image = {
  value: string,
  label: string,
}

export default function AsyncTagSelect(props: { onChange: (val: SingleValue<Image>) => void}) {
  async function tagOptions(input: string) {
    // replace with DB query
    return images.filter(t => t.label.toLowerCase().includes(input.toLowerCase()));
  }

  return <AsyncSelect cacheOptions defaultOptions loadOptions={tagOptions} onChange={props.onChange} />
}