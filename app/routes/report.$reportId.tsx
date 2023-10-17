import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import {
  Form,
  Link,
  ShouldRevalidateFunction,
  useOutletContext,
} from '@remix-run/react';
import { useEventSource } from 'remix-utils/sse/react';
import { statusEmitter } from '~/statusEmitter';

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

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.reportId) return new Response('Not found', { status: 404 });

  return json({ data: { reportId: params.reportId } });
}

export async function action() {
  statusEmitter();

  return json({ noRevalidation: true });
}

export default function Report() {
  const { data } = useOutletContext<{ data: string }>();
  const reportStatus = useEventSource('/report/subscribe', {
    event: 'reportStatus',
  });

  console.log('RENDER REPORT', data);

  return (
    <>
      <Link to="/">Home</Link>
      <Form method="post">
        <button
          disabled={
            reportStatus === 'work_started' || reportStatus === 'working'
          }
        >
          Start work
        </button>
      </Form>
      <div>Report status: {reportStatus || 'idle'}</div>
    </>
  );
}
