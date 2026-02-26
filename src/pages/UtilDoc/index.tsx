import React, { useState } from 'react';
import MethodDoc from './components/MethodDoc';
import RightNav from './components/RightNav';
import Sidebar from './components/Sidebar';
import { utilDocData } from './data/methodDocs';
import styles from './styles/index.less';

const UtilDocPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('intro');

  return (
    <div className={styles.container}>
      <Sidebar
        data={utilDocData}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />
      <main className={styles.main}>
        <MethodDoc data={utilDocData} activeModule={activeModule} />
      </main>
      <RightNav data={utilDocData} activeModule={activeModule} />
    </div>
  );
};

export default UtilDocPage;
