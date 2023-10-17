import type { MetaFunction } from '@remix-run/node';
import {
  Link,
  Outlet,
  ShouldRevalidateFunction,
  useOutletContext,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const shouldRevalidate: ShouldRevalidateFunction = ({
  actionResult,
  defaultShouldRevalidate,
}) => {
  if (actionResult?.noRevalidation) {
    console.log('no revalidation');
    return false;
  }

  return defaultShouldRevalidate;
};

export default function Index() {
  const { data } = useOutletContext<{ data: string }>();

  console.log('RENDER _index', data);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1>Welcome to Remix</h1>
      <Link to="/report/foo">Reports</Link>
      <Outlet context={{ data }} />
    </div>
  );
}
