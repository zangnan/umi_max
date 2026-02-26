import DDAITheme from '@/components/DDXai/AITheme';
import { useAntdConfig, useAntdConfigSetter } from 'umi';

const Independent: React.FC = () => {
  const setAntdConfig = useAntdConfigSetter();
  const antdConfig: any = useAntdConfig();
  return (
    <DDAITheme config={{
      setAntdConfig,
      antdConfig
    }}/>
  );
};

export default Independent;