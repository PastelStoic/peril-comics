import AsyncSelect from 'react-select/async';
import type { SingleValue } from 'react-select/dist/declarations/src';
import { trpc } from 'src/utils/trpc';

// generic component for unified style
export default function AsyncSearchBar<T>(props: { fetchValues: (input: string) => Promise<T[]>, onChange: (val: SingleValue<T>) => void}) {
  return <AsyncSelect className='text-black' cacheOptions defaultOptions loadOptions={props.fetchValues} onChange={props.onChange} />
}

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

export function ImageSearchBar(props: { onChange: (val: SingleValue<Image>) => void}) {  
  async function imageOptions(input: string) {
  // replace with DB query
  return images.filter(t => t.label.toLowerCase().includes(input.toLowerCase()));
}
  return AsyncSearchBar<Image>({ ...props, fetchValues: imageOptions });
}

export type Tag = {
  value: string,
  label: string,
}

export function TagSearchBar(props: { onChange: (val: SingleValue<Tag>) => void}) {
  const query = trpc.tags.search.useMutation();

  async function tagOptions(input: string) {
    const result = await query.mutateAsync({name: input});
    return result?.map(r => ({value: r.ref_name, label: r.display_name})) ?? [];
  }
  
  return AsyncSearchBar<Tag>({ ...props, fetchValues: tagOptions});
}