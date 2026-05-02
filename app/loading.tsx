import Loading from '@/components/Loading/Loading';

import style from './home.module.css'

export default function LoadingPage() {
  return (
    <div
      className={style.loadingPage}
    >
      <Loading />
    </div>
  );
}
