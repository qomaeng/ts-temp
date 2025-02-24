'use client';

import {
  type ReactNode,
  type RefObject,
  type JSX,
  useState,
  useRef,
  useEffect,
} from 'react';

//const ThemeContext = createContext('light');
//
//export function MyApp(): JSX.Element {
//  return (
//    <ThemeContext.Provider value="dark">
//      <Form />
//    </ThemeContext.Provider>
//  );
//}
//
//export function Form(): JSX.Element {
//  return (
//    <Panel title="Welcome">
//      <Button show={true}>Sign up</Button>
//      <Button show={false}>Log in</Button>
//    </Panel>
//  );
//}

export function Expandable({ children }: { children: ReactNode }): JSX.Element {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button onClick={() => setExpanded(!expanded)}>Toggle</button>
      {expanded && children}
    </div>
  );
}

export function CatFriends(): JSX.Element {
  const listRef: RefObject<null | HTMLUListElement> = useRef(null);

  function scrollToIndex(index: number): void {
    const listNode = listRef.current;
    if (listNode === null) {
      return;
    }

    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>Neo</button>
        <button onClick={() => scrollToIndex(1)}>Millie</button>
        <button onClick={() => scrollToIndex(2)}>Bella</button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img src="https://placecats.com/neo/300/200" alt="Neo" />
          </li>
          <li>
            <img src="https://placecats.com/millie/200/200" alt="Neo" />
          </li>
          <li>
            <img src="https://placecats.com/bella/199/200" alt="Neo" />
          </li>
        </ul>
      </div>
    </>
  );
}

export class FadeInAnimation {
  protected node: HTMLElement;
  protected duration: number;
  protected startTime: number | null;
  protected frameId: number | null;

  constructor(node: HTMLElement) {
    this.node = node;
    this.duration = 0;
    this.startTime = null;
    this.frameId = null;
  }

  start(duration: number): void {
    this.duration = duration;
    if (this.duration === 0) {
      this.onProgress(1);
    } else {
      this.onProgress(0);
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }

  private onFrame(): void {
    const timeElpased = performance.now() - (this.startTime || 0);
    const progress = Math.min(timeElpased / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }

  private onProgress(progress: number): void {
    this.node.style.opacity = String(progress);
  }

  stop(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
    }
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}

function ModalDialog({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: ReactNode;
}): JSX.Element {
  const ref: RefObject<HTMLDialogElement | null> = useRef(null);

  useEffect(() => {
    const dialog = ref.current;

    if (isOpen) {
      dialog?.showModal();
    }

    return (): void => {
      dialog?.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}

export default function DashboardLayout({
  children,
}: {
  children?: ReactNode;
}): JSX.Element {
  const [show, setShow] = useState(false);

  return (
    <section>
      <header>
        <h1>Welcome to {null}'s Dashboard'</h1>
      </header>
      <div>
        <button onClick={() => setShow(true)}>Open dialog</button>
        <ModalDialog isOpen={show}>
          Hello there!
          <br />
          <button onClick={() => setShow(false)}>Close</button>
        </ModalDialog>
      </div>
      <main>{children}</main>
    </section>
  );
}
