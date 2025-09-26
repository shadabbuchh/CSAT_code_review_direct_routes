import { Routes, Route, Navigate } from 'react-router-dom';
import { H1, AppLayout } from '@/components';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Default redirect to main page */}
        <Route path="/" element={<Navigate to="/csatform" replace />} />

        {/* Main application page */}
        <Route
          path="/csatform"
          element={<H1 className="text-3xl font-bold">Csatform</H1>}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/csatform" replace />} />
      </Route>
    </Routes>
  );
};
