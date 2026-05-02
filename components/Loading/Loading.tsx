import style from './Loading.module.css'

export default function Loading() {
  return (
    <div className={style.loadingContainer}>
      <div className={style.spinner} aria-hidden="true"></div>

      <span className={style.srOnly}>
        Carregando o conteúdo...
      </span>
    </div>
  );
}
