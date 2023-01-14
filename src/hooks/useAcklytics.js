import useAckee from 'use-ackee';

export function useAcklytics(tabValue) {
  useAckee(
    tabValueToString(tabValue),
    {
      server: 'https://acklytics.vercel.app',
      domainId: '958bad58-396e-4a69-b23c-8c7f6d93c7ce',
    },
    {
      detailed: true,
      ignoreLocalhost: true,
      ignoreOwnVisits: true,
    }
  );
}

function tabValueToString(tabValue) {
  switch (tabValue) {
    case 0:
      return 'search';
    case 1:
      return 'select';
    case 2:
      return 'about';
    default:
      return '/';
  }
}
