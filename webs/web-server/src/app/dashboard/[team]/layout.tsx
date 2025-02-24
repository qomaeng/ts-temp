import type { JSX } from 'react';

export default async function Layout({
  params,
}: {
  params: Promise<{ team: string }>;
}): Promise<JSX.Element> {
  return <h1>{(await params).team}</h1>;
}
