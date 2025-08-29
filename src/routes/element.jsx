import { Suspense, lazy } from 'react';
import Loader from '../components/Loader';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
  
export const ProjectPage = Loadable(lazy(() => import('../pages/project/Project')));
export const ProjectAddPage = Loadable(lazy(() => import('../pages/project/create/Index')));
export const ProjectViewPage = Loadable(lazy(() => import('../pages/project/view/Index')));
 
 