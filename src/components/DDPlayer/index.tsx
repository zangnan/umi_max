import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Space, Card, Button, Image, Slider, Progress, Tooltip, Flex, Dropdown } from 'antd';
import CONSTANTS from '../DDAssist/constants';
import { cloneDeep } from 'lodash';
import ReactPlayer from 'react-player';
import myUtil from '../DDAssist/util';
import { NotificationOutlined, CaretRightOutlined, PauseOutlined, ForwardOutlined, BackwardOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import './style.less';
import '@icon-park/react/styles/index.less';
import {Pause, VolumeMute, VolumeNotice, FullScreenPlay, PlayOne} from '@icon-park/react';

// const DEFAULT_VEDIO_HEIGHT: any = '500px';
const DEFAULT_VEDIO_HEIGHT: any = 'calc(100vh - 80px)';
// const DEFAULT_VEDIO_HEIGHT: any = 'calc(100vh - 8px)';
const DEFAULT_VEDIO_VOLUME: any = 0.5;

const DDPlayer: React.FC<any> = ({
  // url = 'http://192.168.21.5:7777/testmedia/test01.mp4',
  url = 'http://192.168.21.5:7777/testmedia/test12.mp4',
  // url = 'http://192.168.21.3:18088/dict/automatic/exp/bs/getMedia/38d1ad26c9617c03aa671068b29380c0'
}) => {
  const playerRef: any = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef: any = useRef();
  const [volume, setVolume] = useState(DEFAULT_VEDIO_VOLUME);
  const [volumeIsOpen, setVolumeIsOpen] = useState(true);
  const [finelVolume, setFinelVolume] = useState(DEFAULT_VEDIO_VOLUME);
  const [played, setPlayed] = useState(1);
  const [isPip, setIsPip] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [percent, setPercent] = useState<number>(60);
  const [successPercent, setSuccessPercent] = useState<number>(0);
  const [videoHeight, setVideoHeight] = useState<any>(DEFAULT_VEDIO_HEIGHT);
  const [mediaUrl, setMediaUrl] = useState<any>(url);
  const increase = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent + 10;
      if (newPercent > 100) {
        return 100;
      }
      return newPercent;
    });
  };
  const decline = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent - 10;
      if (newPercent < 0) {
        return 0;
      }
      return newPercent;
    });
  };
  const handlePlaybackRate = (rate: any) => {
    setPlaybackRate(rate);
  };


  // const handlePlayPause = () => {
  //     setPlaying((prev) => !prev);
  // };

  const handlePlayPause = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const seekForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const seekBackward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const togglePictureInPicture = async () => {
    if (playerRef.current && !isPip) {
      try {
        await playerRef.current.getInternalPlayer().requestPictureInPicture();
        setIsPip(true);
      } catch (error) {
        console.error('画中画请求失败:', error);
      }
    } else if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      setIsPip(false);
    }
  };

  const reactPlayerOnProgress = ({ played }: any) => {
    setPlayed(played);
    setSuccessPercent(played * 100);
    setPercent(playerRef?.current?.getSecondsLoaded() / playerRef?.current?.getDuration() * 100);
  }

  const items: any = [
    { key: 3, label: '3.0X' },
    { key: 2, label: '2.0X' },
    { key: 1.5, label: '1.5X' },
    { key: 1, label: '1.0X' },
    { key: 0.75, label: '0.75X' },
    { key: 0.5, label: '0.5X' },
  ];
  const style: React.CSSProperties = {
    display: 'inline-block',
    height: 100,
    marginInlineStart: 0,
  };
  const onChangeSlider = (value: any) => {
    setVolume(value);
  };
  const onChangeSlider2 = (value: any) => {
    setPlayed(value);
    setSuccessPercent(value * 100);
    setPercent(playerRef?.current?.getSecondsLoaded() / playerRef?.current?.getDuration() * 100);
    // const newValue = parseFloat(e.target.value);
    // setPlayed(newValue);
    playerRef.current.seekTo(value);
  };
  const onChangeCompleteSlider = (value: number | number[]) => {
    // console.log('onChangeComplete: ', value);
  };
  const items2: any = [
    { key: 3, label: <><div style={style}>
    <Slider vertical value={volume} onChange={onChangeSlider}  min={0} max={1} step={0.01}/>
  </div></> },
  ];

  const onMenuClick: any = useCallback((event: any) => {
    const { key } = event;
    handlePlaybackRate(Number(key));
  }, []);

  const volumeSwitch = () => {
    setFinelVolume(volume);
    setVolumeIsOpen(!volumeIsOpen);
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(finelVolume);
    }
  }

  const iconBtnStyle: any = {
    theme: 'filled',
  }

  const toggleFullscreen = () => {
    // console.info('原 toggleFullscreen ~~~~~~~~~~~', isFullscreen);
    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
      setVideoHeight('100%');
    } else {
      if (!document.hidden) {
        try {
          if (document.fullscreenElement) {
            document.exitFullscreen();
            setVideoHeight(DEFAULT_VEDIO_HEIGHT);
          }
        } catch (err) {
          console.error(err);
        }
      }

    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      // console.info('event.key', event.key);
      switch (event.key) {
        case ' ':
          handlePlayPause();
          event.preventDefault();
          break;
        case 'ArrowRight':
          seekForward();
          break;
        case 'ArrowLeft':
          seekBackward();
          break;
        case 'f':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, seekForward, seekBackward,
    toggleFullscreen
  ]);

  useEffect(() => {
    // let tmpUrl = window.location.search;
    let tmpUrl = window.location.href;
    // tmpUrl = tmpUrl.replace('?mediaPath=', '');
    tmpUrl = tmpUrl?.split('?mediaPath=')[1];
    // tmpUrl = `${API_URL_BASE}${APP_BASE ? '/' + APP_BASE : ''}/dict/${tmpUrl}`;
    // debugger;
    if (tmpUrl) {
      if (tmpUrl?.indexOf('http://') > -1 || tmpUrl?.indexOf('https://') > -1) {
      } else {
        tmpUrl = `${API_URL_BASE}/dict/${tmpUrl}`;
      }
      setMediaUrl(tmpUrl);
    }
    // tmpUrl = `${API_URL_BASE}/dict/${tmpUrl}`;
    // tmpUrl = `${tmpUrl}`;
    // console.info(tmpUrl);
  }, []);


  // useEffect(() => {
  //   const handleKeyDown = (event: any) => {
  //     console.log('ESC pressed in fullscreen mode');
  //     console.log(event.key);
  //     console.log(document.fullscreenElement);
  //     if (event.key === 'Escape') {
  //     // if (event.key === 'Escape' && document.fullscreenElement) {
  //     //   console.log('ESC pressed in fullscreen mode');
  //     //   // 处理ESC按键按下的逻辑
  //       toggleFullscreen();
  //     }
  //   };
  //   document.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     document.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []); // 空数组[]意味着这个effect只会在组件挂载时执行一次

  return <>
    <div className={`video_wrap ${isFullscreen ? 'video_wrap_full_screen' : ''}`}>
      <div ref={videoRef}>
        <div className="play_wrap">
          <ReactPlayer url={mediaUrl} ref={playerRef} playing={playing} controls={false} height={videoHeight} width="100%" volume={volume}
            onProgress={({played}) => {reactPlayerOnProgress({played})}}
            onReady={() => setIsFullscreen(false)}
            playbackRate={playbackRate}
          />
        </div>
        <div className="video_toolbar">
          <div className="video_toolbar_show_flag">
            <div className="video_toolbar_progress">
              <Progress percent={percent} success={{ percent: successPercent, strokeColor: '#1972a4' }} trailColor="#434343" showInfo={false} strokeLinecap="butt" />
              <Slider className='aaaaa' value={played} onChange={onChangeSlider2} min={0} max={0.99999999} step={0.001} tooltip={{formatter: null}}/>
            </div>
            <div className='video_toolbar_control'>
              <Flex justify='space-between' align='center'>
                <Space>
                  <span className='btnlink' onClick={handlePlayPause}>{playing?<PauseOutlined/>:<CaretRightOutlined/>}</span>
                  <Button type='link' icon={<BackwardOutlined />} onClick={seekBackward}></Button>
                  <span>{myUtil.date.formatMillisecondsToHMS(playerRef?.current?.getCurrentTime()*1000)}</span>
                  <span>/</span>
                  <span>{myUtil.date.formatMillisecondsToHMS(playerRef?.current?.getDuration()*1000)}</span>
                  <Button type='link' icon={<ForwardOutlined />} onClick={seekForward}></Button>
                </Space>
                <Space size='large'>
                  <Dropdown menu={{ items: items2}} placement="topCenter" overlayClassName='control_volumn'>
                    { volumeIsOpen ? <VolumeNotice { ...iconBtnStyle } onClick={volumeSwitch}/> : <VolumeMute { ...iconBtnStyle } onClick={volumeSwitch}/>}
                  </Dropdown>
                  <Dropdown menu={{ items, onClick: onMenuClick}} placement="topLeft" overlayClassName='control_speed'>
                    <span className='btnlink'>倍速{ playbackRate !==1 && `${playbackRate}X`}</span>
                  </Dropdown>
                  <FullScreenPlay { ...iconBtnStyle } onClick={toggleFullscreen}/>
                </Space>
              </Flex>
            </div>
          </div>
        </div>
      </div>
      {/* <Button type='default' icon={playing ? <FullscreenExitOutlined /> : <FullscreenOutlined />} onClick={togglePictureInPicture}>{isPip ? '退出全屏' : '全屏播放'}</Button>*/}
    </div>
    {/* <Space>
      <div>play: {played}</div>
      <div>getCurrentTime={playerRef?.current?.getCurrentTime()}</div>
      <div>getDuration={playerRef?.current?.getDuration()}</div>
      <div>getSecondsLoaded={playerRef?.current?.getSecondsLoaded()}</div>
      <div>volume: {volume}</div>
    </Space> */}
  </>
}

export default DDPlayer;