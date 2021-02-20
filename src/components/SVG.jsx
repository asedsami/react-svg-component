import React, { useState, useRef, useEffect } from "react";
import { isEventMultitouch } from "../utils";
const { log: clog } = console;

function SVG(props) {
  let svgRef = useRef(null);
  let point = useRef(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [pointerOrigin, setPointerOrigin] = useState(point);
  const [initialTargetTouches, setInitialTargetTouches] = useState({
    touch1: {},
    touch2: {}
  });
  const [isMultiTouching, setIsMultiTouching] = useState(false);
  const [viewBoxArr, setViewBox] = useState(props.viewBox.split(" "));

  useEffect(() => {
    point.current = svgRef.current.createSVGPoint();
  });

  const getPoint = (clientX, clientY) => {
    if (!point) {
      return;
    }

    point.current.x = clientX;
    point.current.y = clientY;

    const invertedSVGMatrix = svgRef.current.getScreenCTM().inverse();
    return point.current.matrixTransform(invertedSVGMatrix);
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    const newPointerPosition = getPoint(e.clientX, e.clientY);
    setPointerOrigin(newPointerPosition);
    setIsMouseDown(true);
  };

  const onMouseMove = (e) => {
    const newPointerPosition = getPoint(e.clientX, e.clientY);
    if (isMouseDown) {
      e.preventDefault();
      setViewBox([
        viewBoxArr[0] - (newPointerPosition.x - pointerOrigin?.x),
        viewBoxArr[1] - (newPointerPosition.y - pointerOrigin?.y),
        viewBoxArr[2],
        viewBoxArr[3]
      ]);
    }
  };

  const onMouseUp = (e) => {
    e.preventDefault();
    setIsMouseDown(false);
  };

  const onTouchStart = (e) => {
    e.preventDefault();
    if (isEventMultitouch(e)) {
      clog(84, e.targetTouches);
      // TODO: handle MultiTouch Start
    } else {
      const newPointerPosition = getPoint(
        e.targetTouches[0].clientX,
        e.targetTouches[0].clientY
      );
      setPointerOrigin(newPointerPosition);
    }
  };

  const onTouchMove = (e) => {
    e.preventDefault();

    if (isEventMultitouch(e)) {
      clog(97, e.targetTouches);
      // TODO: handle Multitouch Move
      return;
    } else {
      const newPointerPosition = getPoint(
        e.targetTouches[0].clientX,
        e.targetTouches[0].clientY
      );
      setViewBox([
        viewBoxArr[0] - (newPointerPosition.x - pointerOrigin?.x),
        viewBoxArr[1] - (newPointerPosition.y - pointerOrigin?.y),
        viewBoxArr[2],
        viewBoxArr[3]
      ]);
    }
  };

  const onTouchEnd = (e) => {
    e.preventDefault();
  };

  const viewBox = viewBoxArr.join(" ");

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        ref={svgRef}
        width={props.width}
        height={props.height}
        viewBox={viewBox}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {props.children}
      </svg>
    </>
  );
}

export default SVG;

