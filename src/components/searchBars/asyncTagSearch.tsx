import AsyncSelect from 'react-select/async';
import type { SingleValue } from 'react-select/dist/declarations/src';

const tags = [
  {
    value: "opacity",
    label: "Opacity",
  },
  {
    label: "Underwear",
    value: "underwear",
  },
];

export type Tag = {
  value: string,
  label: string,
}

export default function AsyncTagSelect(props: { onChange: (val: SingleValue<Tag>) => void}) {
  async function tagOptions(input: string) {
    // replace with DB query
    return tags.filter(t => t.label.toLowerCase().includes(input));
  }

  return <AsyncSelect cacheOptions defaultOptions loadOptions={tagOptions} onChange={props.onChange} />
}