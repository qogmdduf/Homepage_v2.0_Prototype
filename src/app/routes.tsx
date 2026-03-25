import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const SolutionDetailPage = lazy(() => import("./pages/SolutionDetailPage").then(m => ({ default: m.SolutionDetailPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const DesignSystemPage = lazy(() => import("./pages/DesignSystemPage").then(m => ({ default: m.DesignSystemPage })));

const AboutSectionLayout = lazy(() =>
  import("./components/about/AboutSectionLayout").then(m => ({ default: m.AboutSectionLayout })),
);
const AboutHubPage = lazy(() => import("./pages/about/AboutHubPage").then(m => ({ default: m.AboutHubPage })));
const AboutCompanyPage = lazy(() => import("./pages/about/AboutCompanyPage").then(m => ({ default: m.AboutCompanyPage })));
const AboutVisionPage = lazy(() => import("./pages/about/AboutVisionPage").then(m => ({ default: m.AboutVisionPage })));
const AboutServicesPage = lazy(() => import("./pages/about/AboutServicesPage").then(m => ({ default: m.AboutServicesPage })));
const AboutCasesPage = lazy(() => import("./pages/about/AboutCasesPage").then(m => ({ default: m.AboutCasesPage })));
const AboutCaseDetailPage = lazy(() => import("./pages/about/AboutCaseDetailPage").then(m => ({ default: m.AboutCaseDetailPage })));
const AboutTeamPage = lazy(() => import("./pages/about/AboutTeamPage").then(m => ({ default: m.AboutTeamPage })));
const AboutProcessPage = lazy(() => import("./pages/about/AboutProcessPage").then(m => ({ default: m.AboutProcessPage })));
const AboutInsightsPage = lazy(() => import("./pages/about/AboutInsightsPage").then(m => ({ default: m.AboutInsightsPage })));
const AboutCareersPage = lazy(() => import("./pages/about/AboutCareersPage").then(m => ({ default: m.AboutCareersPage })));
const AboutContactPage = lazy(() => import("./pages/about/AboutContactPage").then(m => ({ default: m.AboutContactPage })));
const WizFlowBrochureCapturePage = lazy(() =>
  import("./pages/WizFlowBrochureCapturePage").then(m => ({ default: m.WizFlowBrochureCapturePage })),
);
const WizFlowSalesBrochurePage = lazy(() =>
  import("./pages/WizFlowSalesBrochurePage").then(m => ({ default: m.WizFlowSalesBrochurePage })),
);

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      {children}
    </Suspense>
  );
}

/** GitHub Pages 프로젝트 사이트(`/repo/`)와 로컬(`/`) 모두 지원 */
const routerBasename =
  import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '');

export const router = createBrowserRouter(
  [
  {
    path: "/design-system",
    element: <SuspenseWrapper><DesignSystemPage /></SuspenseWrapper>,
  },
  {
    path: "/brochure/wiz-flow",
    element: (
      <SuspenseWrapper>
        <LanguageProvider>
          <ErrorBoundary>
            <WizFlowBrochureCapturePage />
          </ErrorBoundary>
        </LanguageProvider>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/brochure/wiz-flow/sales",
    element: (
      <SuspenseWrapper>
        <LanguageProvider>
          <ErrorBoundary>
            <WizFlowSalesBrochurePage />
          </ErrorBoundary>
        </LanguageProvider>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        element: <SuspenseWrapper><HomePage /></SuspenseWrapper>,
      },
      {
        path: "about",
        element: <SuspenseWrapper><AboutSectionLayout /></SuspenseWrapper>,
        children: [
          { index: true, element: <SuspenseWrapper><AboutHubPage /></SuspenseWrapper> },
          { path: "company", element: <SuspenseWrapper><AboutCompanyPage /></SuspenseWrapper> },
          { path: "vision", element: <SuspenseWrapper><AboutVisionPage /></SuspenseWrapper> },
          { path: "services", element: <SuspenseWrapper><AboutServicesPage /></SuspenseWrapper> },
          { path: "cases", element: <SuspenseWrapper><AboutCasesPage /></SuspenseWrapper> },
          { path: "cases/:caseId", element: <SuspenseWrapper><AboutCaseDetailPage /></SuspenseWrapper> },
          { path: "team", element: <SuspenseWrapper><AboutTeamPage /></SuspenseWrapper> },
          { path: "process", element: <SuspenseWrapper><AboutProcessPage /></SuspenseWrapper> },
          { path: "insights", element: <SuspenseWrapper><AboutInsightsPage /></SuspenseWrapper> },
          { path: "careers", element: <SuspenseWrapper><AboutCareersPage /></SuspenseWrapper> },
          { path: "contact", element: <SuspenseWrapper><AboutContactPage /></SuspenseWrapper> },
        ],
      },
      {
        path: "solution/:id",
        element: <SuspenseWrapper><SolutionDetailPage /></SuspenseWrapper>,
      },
      {
        path: "*",
        element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
      },
    ],
  },
  ],
  { basename: routerBasename },
);
