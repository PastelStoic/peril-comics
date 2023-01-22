import Link from "next/link";

export default function AdminHome() {
  return (
    <>
    <Link href={"/admin/comics"}>Edit Comics</Link>
    <br />
    <Link href={"/admin/images"}>Upload or Manage Images</Link>
    </>
  );
}