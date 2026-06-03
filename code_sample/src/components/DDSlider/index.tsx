import { useRef, useState, useEffect, MutableRefObject } from 'react';
import './style.less';
import { LoadingOutlined, DoubleRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
export default function Slider(props: any) {
  const { showSlider } = props;
  const checkCircleRef: MutableRefObject<any> = useRef();
  const doubleRightRef: MutableRefObject<any> = useRef();
  
  const [rangeStatus, setRangeStatus] = useState(false);
  const [successText, setSuccessText] = useState('验证成功');
  const [startText, setStartText] = useState('请拖住滑块，拖动到最右边');
 
  const errorFun = () => {
    props.resultClick('N');
  };
  const successFun = () => {
    props.resultClick('Y');
  };
  const rangeMove = (e: any) => {
    let ele = rangeStatus ? checkCircleRef.current : doubleRightRef.current;
    let startX = e.clientX;
    let eleWidth = ele.offsetWidth;
    let parentWidth = ele.parentElement.offsetWidth;
    let MaxX = parentWidth - eleWidth;
    if (rangeStatus) {
      // 不运行
      return false;
    }
    let disX: any;
    document.onmousemove = (e) => {
      let endX = e.clientX
      disX = endX - startX
      if (disX <= 0) {
        disX = 0
      }
      if (disX >= MaxX - eleWidth) {
        // 减去滑块的宽度,体验效果更好
        disX = MaxX
      }
      ele.style.borderRadius = '0 4px 4px 0';
      ele.style.transition = '.1s all';
      ele.style.transform = 'translateX(' + disX + 'px)';
      let left: any = document.querySelector('.dd-left');
      left.style.transition = '.1s all'
      left.style.transform = 'translateX(' + disX + 'px)';
      e.preventDefault();
    }
    document.onmouseup = () => {
      if (disX !== MaxX) {
        ele.style.borderRadius = '4px';
        ele.style.transition = '.5s all'
        ele.style.transform = 'translateX(0)'
        let left: any = document.querySelector('.dd-left')
        left.style.transition = '.5s all'
        left.style.transform = 'translateX(0)'
        // 执行失败的函数
        errorFun();
      } else {
        setRangeStatus(true);
        checkCircleRef.current.style.borderRadius = '0 4px 4px 0';
        checkCircleRef.current.style.transition = '.1s all';
        checkCircleRef.current.style.transform = 'translateX(' + disX + 'px)';
        // 执行成功的函数
        successFun()
      }
      document.onmousemove = null
      document.onmouseup = null
    }
  };

  useEffect(() => {
    if (!showSlider) {
      setSuccessText('');
    }
  });
  return (
    <div className="dd-component__range">
      <div className="dd-left" style={{ backgroundColor: '#3bc923', width: '100%', height: '100%' }}></div>
      <div className={'dd-range'} style={{ overflow: "hidden" }}>
        {
          rangeStatus ? 
          <CheckCircleOutlined onMouseDown={rangeMove} style={{ zIndex: 4 }} ref={checkCircleRef} className="simple-slider" /> : 
          <DoubleRightOutlined onMouseDown={rangeMove} style={{ zIndex: 4 }} ref={doubleRightRef} className="simple-slider" />
        }
        <span style={{ zIndex: 3 }}>{ rangeStatus ? successText : startText }</span>
      </div>
    </div>
  );
}