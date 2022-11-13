var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
import React from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from "react-native";
import {
  Circle,
  G,
  Path,
  Polygon,
  Polyline,
  Rect,
  Svg
} from "react-native-svg";
import AbstractChart from "../AbstractChart";
import { LegendItem } from "./LegendItem";
var AnimatedCircle = Animated.createAnimatedComponent(Circle);
var LineChart = /** @class */ (function(_super) {
  __extends(LineChart, _super);
  function LineChart() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.label = React.createRef();
    _this.state = {
      scrollableDotHorizontalOffset: new Animated.Value(0)
    };
    _this.getColor = function(dataset, opacity) {
      return (dataset.color || _this.props.chartConfig.color)(opacity);
    };
    _this.getStrokeWidth = function(dataset) {
      return dataset.strokeWidth || _this.props.chartConfig.strokeWidth || 3;
    };
    _this.getDatas = function(data) {
      return data.reduce(function(acc, item) {
        return item.data ? __spreadArrays(acc, item.data) : acc;
      }, []);
    };
    _this.getPropsForDots = function(x, i) {
      var _a = _this.props,
        getDotProps = _a.getDotProps,
        chartConfig = _a.chartConfig;
      if (typeof getDotProps === "function") {
        return getDotProps(x, i);
      }
      var _b = chartConfig.propsForDots,
        propsForDots = _b === void 0 ? {} : _b;
      return __assign({ r: "4" }, propsForDots);
    };
    _this.renderDots = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        onDataPointClick = _a.onDataPointClick;
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var _b = _this.props,
        getDotColor = _b.getDotColor,
        _c = _b.hidePointsAtIndex,
        hidePointsAtIndex = _c === void 0 ? [] : _c,
        _d = _b.renderDotContent,
        renderDotContent =
          _d === void 0
            ? function() {
                return null;
              }
            : _d;
      data.forEach(function(dataset) {
        if (dataset.withDots == false) return;
        dataset.data.forEach(function(x, i) {
          if (hidePointsAtIndex.includes(i)) {
            return;
          }
          var chunks = dataset.data.length == 1 ? 1 : dataset.data.length - 1;
          var cx = paddingRight + (i * (width - paddingRight)) / chunks - 5;
          var cy =
            ((baseHeight - _this.calcHeight(x, datas, height)) / 4) * 3 +
            paddingTop;
          var onPress = function() {
            if (!onDataPointClick || hidePointsAtIndex.includes(i)) {
              return;
            }
            onDataPointClick({
              index: i,
              value: x,
              dataset: dataset,
              x: cx,
              y: cy,
              getColor: function(opacity) {
                return _this.getColor(dataset, opacity);
              }
            });
          };
          output.push(
            <Circle
              key={Math.random()}
              cx={cx}
              cy={cy}
              fill={
                typeof getDotColor === "function"
                  ? getDotColor(x, i)
                  : _this.getColor(dataset, 0.9)
              }
              onPress={onPress}
              {..._this.getPropsForDots(x, i)}
            />,
            <Circle
              key={Math.random()}
              cx={cx}
              cy={cy}
              r="14"
              fill="#fff"
              fillOpacity={0}
              onPress={onPress}
            />,
            renderDotContent({ x: cx, y: cy, index: i, indexData: x })
          );
        });
      });
      return output;
    };
    _this.renderScrollableDot = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingTop = _a.paddingTop,
        paddingRight = _a.paddingRight,
        scrollableDotHorizontalOffset = _a.scrollableDotHorizontalOffset,
        scrollableDotFill = _a.scrollableDotFill,
        scrollableDotStrokeColor = _a.scrollableDotStrokeColor,
        scrollableDotStrokeWidth = _a.scrollableDotStrokeWidth,
        scrollableDotRadius = _a.scrollableDotRadius,
        scrollableInfoViewStyle = _a.scrollableInfoViewStyle,
        scrollableInfoTextStyle = _a.scrollableInfoTextStyle,
        _b = _a.scrollableInfoTextDecorator,
        scrollableInfoTextDecorator =
          _b === void 0
            ? function(x) {
                return "" + x;
              }
            : _b,
        scrollableInfoSize = _a.scrollableInfoSize,
        scrollableInfoOffset = _a.scrollableInfoOffset;
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var vl = [];
      var perData = width / data[0].data.length;
      for (var index = 0; index < data[0].data.length; index++) {
        vl.push(index * perData);
      }
      var lastIndex;
      scrollableDotHorizontalOffset.addListener(function(value) {
        var index = value.value / perData;
        if (!lastIndex) {
          lastIndex = index;
        }
        var abs = Math.floor(index);
        var percent = index - abs;
        abs = data[0].data.length - abs - 1;
        if (index >= data[0].data.length - 1) {
          _this.label.current.setNativeProps({
            text: scrollableInfoTextDecorator(Math.floor(data[0].data[0]))
          });
        } else {
          if (index > lastIndex) {
            // to right
            var base = data[0].data[abs];
            var prev = data[0].data[abs - 1];
            if (prev > base) {
              var rest = prev - base;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base + percent * rest)
                )
              });
            } else {
              var rest = base - prev;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base - percent * rest)
                )
              });
            }
          } else {
            // to left
            var base = data[0].data[abs - 1];
            var next = data[0].data[abs];
            percent = 1 - percent;
            if (next > base) {
              var rest = next - base;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base + percent * rest)
                )
              });
            } else {
              var rest = base - next;
              _this.label.current.setNativeProps({
                text: scrollableInfoTextDecorator(
                  Math.floor(base - percent * rest)
                )
              });
            }
          }
        }
        lastIndex = index;
      });
      data.forEach(function(dataset) {
        if (dataset.withScrollableDot == false) return;
        var perData = width / dataset.data.length;
        var values = [];
        var yValues = [];
        var xValues = [];
        var yValuesLabel = [];
        var xValuesLabel = [];
        for (var index = 0; index < dataset.data.length; index++) {
          values.push(index * perData);
          var yval =
            ((baseHeight -
              _this.calcHeight(
                dataset.data[dataset.data.length - index - 1],
                datas,
                height
              )) /
              4) *
              3 +
            paddingTop;
          yValues.push(yval);
          var xval =
            paddingRight +
            ((dataset.data.length - index - 1) * (width - paddingRight)) /
              dataset.data.length;
          xValues.push(xval);
          yValuesLabel.push(
            yval - (scrollableInfoSize.height + scrollableInfoOffset)
          );
          xValuesLabel.push(xval - scrollableInfoSize.width / 2);
        }
        var translateX = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: xValues,
          extrapolate: "clamp"
        });
        var translateY = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: yValues,
          extrapolate: "clamp"
        });
        var labelTranslateX = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: xValuesLabel,
          extrapolate: "clamp"
        });
        var labelTranslateY = scrollableDotHorizontalOffset.interpolate({
          inputRange: values,
          outputRange: yValuesLabel,
          extrapolate: "clamp"
        });
        output.push([
          <Animated.View
            key={Math.random()}
            style={[
              scrollableInfoViewStyle,
              {
                transform: [
                  { translateX: labelTranslateX },
                  { translateY: labelTranslateY }
                ],
                width: scrollableInfoSize.width,
                height: scrollableInfoSize.height
              }
            ]}
          >
            <TextInput
              onLayout={function() {
                _this.label.current.setNativeProps({
                  text: scrollableInfoTextDecorator(
                    Math.floor(data[0].data[data[0].data.length - 1])
                  )
                });
              }}
              style={scrollableInfoTextStyle}
              ref={_this.label}
            />
          </Animated.View>,
          <AnimatedCircle
            key={Math.random()}
            cx={translateX}
            cy={translateY}
            r={scrollableDotRadius}
            stroke={scrollableDotStrokeColor}
            strokeWidth={scrollableDotStrokeWidth}
            fill={scrollableDotFill}
          />
        ]);
      });
      return output;
    };
    _this.renderShadow = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        useColorFromDataset = _a.useColorFromDataset;
      if (_this.props.bezier) {
        return _this.renderBezierShadow({
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop,
          data: data,
          useColorFromDataset: useColorFromDataset
        });
      }
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      return data.map(function(dataset, index) {
        return (
          <Polygon
            key={index}
            points={
              dataset.data
                .map(function(d, i) {
                  var chunks =
                    dataset.data.length == 1 ? 1 : dataset.data.length - 1;
                  var x =
                    paddingRight + (i * (width - paddingRight)) / chunks - 5;
                  var y =
                    ((baseHeight - _this.calcHeight(d, datas, height)) / 4) *
                      3 +
                    paddingTop;
                  return x + "," + y;
                })
                .join(" ") +
              (" " +
                (paddingRight +
                  ((width - paddingRight) / dataset.data.length) *
                    (dataset.data.length - 1)) +
                "," +
                ((height / 4) * 3 + paddingTop) +
                " " +
                paddingRight +
                "," +
                ((height / 4) * 3 + paddingTop))
            }
            fill={
              "url(#fillShadowGradient" +
              (useColorFromDataset ? "_" + index : "") +
              ")"
            }
            strokeWidth={0}
          />
        );
      });
    };
    _this.renderLine = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        linejoinType = _a.linejoinType;
      if (_this.props.bezier) {
        return _this.renderBezierLine({
          data: data,
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop
        });
      }
      var output = [];
      var datas = _this.getDatas(data);
      var baseHeight = _this.calcBaseHeight(datas, height);
      var lastPoint;
      data.forEach(function(dataset, index) {
        var points = dataset.data.map(function(d, i) {
          if (d === null) return lastPoint;
          var chunks = dataset.data.length == 1 ? 1 : dataset.data.length - 1;
          var x = (i * (width - paddingRight)) / chunks + paddingRight - 5;
          var y =
            ((baseHeight - _this.calcHeight(d, datas, height)) / 4) * 3 +
            paddingTop;
          lastPoint = x + "," + y;
          return x + "," + y;
        });
        output.push(
          <Polyline
            key={index}
            strokeLinejoin={linejoinType}
            points={points.join(" ")}
            fill="none"
            stroke={_this.getColor(dataset, 0.2)}
            strokeWidth={_this.getStrokeWidth(dataset)}
            strokeDasharray={dataset.strokeDashArray}
            strokeDashoffset={dataset.strokeDashOffset}
          />
        );
      });
      return output;
    };
    _this.getBezierLinePoints = function(dataset, _a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data;
      if (dataset.data.length === 0) {
        return "M0,0";
      }
      var datas = _this.getDatas(data);
      var chunks = dataset.data.length == 1 ? 1 : dataset.data.length - 1;
      var x = function(i) {
        return Math.floor(
          paddingRight + (i * (width - paddingRight)) / chunks - 4
        );
      };
      var baseHeight = _this.calcBaseHeight(datas, height);
      var y = function(i) {
        var yHeight = _this.calcHeight(dataset.data[i], datas, height);
        return Math.floor(((baseHeight - yHeight) / 4) * 3 + paddingTop);
      };
      return ["M" + x(0) + "," + y(0)]
        .concat(
          dataset.data.slice(0, -1).map(function(_, i) {
            var x_mid = (x(i) + x(i + 1)) / 2;
            var y_mid = (y(i) + y(i + 1)) / 2;
            var cp_x1 = (x_mid + x(i)) / 2;
            var cp_x2 = (x_mid + x(i + 1)) / 2;
            return (
              "Q " +
              cp_x1 +
              ", " +
              y(i) +
              ", " +
              x_mid +
              ", " +
              y_mid +
              (" Q " +
                cp_x2 +
                ", " +
                y(i + 1) +
                ", " +
                x(i + 1) +
                ", " +
                y(i + 1))
            );
          })
        )
        .join(" ");
    };
    _this.renderBezierLine = function(_a) {
      var data = _a.data,
        width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop;
      return data.map(function(dataset, index) {
        var result = _this.getBezierLinePoints(dataset, {
          width: width,
          height: height,
          paddingRight: paddingRight,
          paddingTop: paddingTop,
          data: data
        });
        return (
          <Path
            key={index}
            d={result}
            fill="none"
            stroke={_this.getColor(dataset, 0.2)}
            strokeWidth={_this.getStrokeWidth(dataset)}
            strokeDasharray={dataset.strokeDashArray}
            strokeDashoffset={dataset.strokeDashOffset}
          />
        );
      });
    };
    _this.renderBezierShadow = function(_a) {
      var width = _a.width,
        height = _a.height,
        paddingRight = _a.paddingRight,
        paddingTop = _a.paddingTop,
        data = _a.data,
        useColorFromDataset = _a.useColorFromDataset;
      return data.map(function(dataset, index) {
        var d =
          _this.getBezierLinePoints(dataset, {
            width: width,
            height: height,
            paddingRight: paddingRight,
            paddingTop: paddingTop,
            data: data
          }) +
          (" L" +
            (paddingRight +
              ((width - paddingRight) / dataset.data.length) *
                dataset.data.length -
              5) +
            "," +
            ((height / 4) * 3 + paddingTop) +
            " L" +
            (paddingRight - 5) +
            "," +
            ((height / 4) * 3 + paddingTop) +
            " Z");
        return (
          <Path
            key={index}
            d={d}
            fill={
              "url(#fillShadowGradient" +
              (useColorFromDataset ? "_" + index : "") +
              ")"
            }
            strokeWidth={0}
          />
        );
      });
    };
    _this.renderLegend = function(width, legendOffset) {
      var _a = _this.props.data,
        legend = _a.legend,
        datasets = _a.datasets;
      var baseLegendItemX = width / (legend.length + 1);
      return legend.map(function(legendItem, i) {
        return (
          <G key={Math.random()}>
            <LegendItem
              index={i}
              iconColor={_this.getColor(datasets[i], 0.9)}
              baseLegendItemX={baseLegendItemX}
              legendText={legendItem}
              labelProps={__assign({}, _this.getPropsForLabels())}
              legendOffset={legendOffset}
            />
          </G>
        );
      });
    };
    return _this;
  }
  LineChart.prototype.render = function() {
    var _a = this.props,
      width = _a.width,
      height = _a.height,
      data = _a.data,
      _b = _a.withScrollableDot,
      withScrollableDot = _b === void 0 ? false : _b,
      _c = _a.withShadow,
      withShadow = _c === void 0 ? true : _c,
      _d = _a.withDots,
      withDots = _d === void 0 ? true : _d,
      _e = _a.withInnerLines,
      withInnerLines = _e === void 0 ? true : _e,
      _f = _a.withOuterLines,
      withOuterLines = _f === void 0 ? true : _f,
      _g = _a.withHorizontalLines,
      withHorizontalLines = _g === void 0 ? true : _g,
      _h = _a.withVerticalLines,
      withVerticalLines = _h === void 0 ? true : _h,
      _j = _a.withHorizontalLabels,
      withHorizontalLabels = _j === void 0 ? true : _j,
      _k = _a.withVerticalLabels,
      withVerticalLabels = _k === void 0 ? true : _k,
      _l = _a.style,
      style = _l === void 0 ? {} : _l,
      decorator = _a.decorator,
      onDataPointClick = _a.onDataPointClick,
      _m = _a.verticalLabelRotation,
      verticalLabelRotation = _m === void 0 ? 0 : _m,
      _o = _a.horizontalLabelRotation,
      horizontalLabelRotation = _o === void 0 ? 0 : _o,
      _p = _a.formatYLabel,
      formatYLabel =
        _p === void 0
          ? function(yLabel) {
              return yLabel;
            }
          : _p,
      _q = _a.formatXLabel,
      formatXLabel =
        _q === void 0
          ? function(xLabel) {
              return xLabel;
            }
          : _q,
      segments = _a.segments,
      _r = _a.transparent,
      transparent = _r === void 0 ? false : _r,
      chartConfig = _a.chartConfig;
    var scrollableDotHorizontalOffset = this.state
      .scrollableDotHorizontalOffset;
    var _s = data.labels,
      labels = _s === void 0 ? [] : _s;
    var _t = style.borderRadius,
      borderRadius = _t === void 0 ? 0 : _t,
      _u = style.paddingTop,
      paddingTop = _u === void 0 ? 16 : _u,
      _v = style.paddingRight,
      paddingRight = _v === void 0 ? 64 : _v,
      _w = style.margin,
      margin = _w === void 0 ? 0 : _w,
      _x = style.marginRight,
      marginRight = _x === void 0 ? 0 : _x,
      _y = style.paddingBottom,
      paddingBottom = _y === void 0 ? 0 : _y;
    var config = {
      width: width,
      height: height,
      verticalLabelRotation: verticalLabelRotation,
      horizontalLabelRotation: horizontalLabelRotation
    };
    var datas = this.getDatas(data.datasets);
    var count =
      Math.min.apply(Math, datas) === Math.max.apply(Math, datas) ? 1 : 4;
    if (segments) {
      count = segments;
    }
    var legendOffset = this.props.data.legend ? height * 0.15 : 0;
    return (
      <View style={style}>
        <Svg
          height={height + paddingBottom + legendOffset}
          width={width - margin * 2 - marginRight}
        >
          <Rect
            width="100%"
            height={height + legendOffset}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
            fillOpacity={transparent ? 0 : 1}
          />
          {this.props.data.legend &&
            this.renderLegend(config.width, legendOffset)}
          <G x="0" y={legendOffset}>
            {this.renderDefs(
              __assign(__assign(__assign({}, config), chartConfig), {
                data: data.datasets
              })
            )}
            <G>
              {withHorizontalLines &&
                (withInnerLines
                  ? this.renderHorizontalLines(
                      __assign(__assign({}, config), {
                        count: count,
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : withOuterLines
                  ? this.renderHorizontalLine(
                      __assign(__assign({}, config), {
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : null)}
            </G>
            <G>
              {withHorizontalLabels &&
                this.renderHorizontalLabels(
                  __assign(__assign({}, config), {
                    count: count,
                    data: datas,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    formatYLabel: formatYLabel,
                    decimalPlaces: chartConfig.decimalPlaces
                  })
                )}
            </G>
            <G>
              {withVerticalLines &&
                (withInnerLines
                  ? this.renderVerticalLines(
                      __assign(__assign({}, config), {
                        data: data.datasets[0].data,
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : withOuterLines
                  ? this.renderVerticalLine(
                      __assign(__assign({}, config), {
                        paddingTop: paddingTop,
                        paddingRight: paddingRight
                      })
                    )
                  : null)}
            </G>
            <G>
              {withVerticalLabels &&
                this.renderVerticalLabels(
                  __assign(__assign({}, config), {
                    labels: labels,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    formatXLabel: formatXLabel
                  })
                )}
            </G>
            <G>
              {this.renderLine(
                __assign(__assign(__assign({}, config), chartConfig), {
                  paddingRight: paddingRight,
                  paddingTop: paddingTop,
                  data: data.datasets
                })
              )}
            </G>
            <G>
              {withShadow &&
                this.renderShadow(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingRight: paddingRight,
                    paddingTop: paddingTop,
                    useColorFromDataset: chartConfig.useShadowColorFromDataset
                  })
                )}
            </G>
            <G>
              {withDots &&
                this.renderDots(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    onDataPointClick: onDataPointClick
                  })
                )}
            </G>
            <G>
              {withScrollableDot &&
                this.renderScrollableDot(
                  __assign(__assign(__assign({}, config), chartConfig), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight,
                    onDataPointClick: onDataPointClick,
                    scrollableDotHorizontalOffset: scrollableDotHorizontalOffset
                  })
                )}
            </G>
            <G>
              {decorator &&
                decorator(
                  __assign(__assign({}, config), {
                    data: data.datasets,
                    paddingTop: paddingTop,
                    paddingRight: paddingRight
                  })
                )}
            </G>
          </G>
        </Svg>
        {withScrollableDot && (
          <ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={{ width: width * 2 }}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: { x: scrollableDotHorizontalOffset }
                }
              }
            ])}
            horizontal
            bounces={false}
          />
        )}
      </View>
    );
  };
  return LineChart;
})(AbstractChart);
export default LineChart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGluZUNoYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpbmUtY2hhcnQvTGluZUNoYXJ0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxLQUFvQixNQUFNLE9BQU8sQ0FBQztBQUN6QyxPQUFPLEVBQ0wsUUFBUSxFQUNSLFVBQVUsRUFDVixVQUFVLEVBQ1YsU0FBUyxFQUNULElBQUksRUFFTCxNQUFNLGNBQWMsQ0FBQztBQUN0QixPQUFPLEVBQ0wsTUFBTSxFQUNOLENBQUMsRUFDRCxJQUFJLEVBQ0osT0FBTyxFQUNQLFFBQVEsRUFDUixJQUFJLEVBQ0osR0FBRyxFQUNKLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxhQUdOLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUUxQyxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFvTTlEO0lBQXdCLDZCQUE2QztJQUFyRTtRQUFBLHFFQW93QkM7UUFud0JDLFdBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxFQUFhLENBQUM7UUFFckMsV0FBSyxHQUFHO1lBQ04sNkJBQTZCLEVBQUUsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNyRCxDQUFDO1FBRUYsY0FBUSxHQUFHLFVBQUMsT0FBZ0IsRUFBRSxPQUFlO1lBQzNDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLEtBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQztRQUVGLG9CQUFjLEdBQUcsVUFBQyxPQUFnQjtZQUNoQyxPQUFPLE9BQU8sQ0FBQyxXQUFXLElBQUksS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsV0FB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Q2YsQ0FDSCxDQUNIO01BQUEsRUFBRSxJQUFJLENBQUMsQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXB3QkQsQ0FBd0IsYUFBYSxHQW93QnBDO0FBRUQsZUFBZSxTQUFTLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgUmVhY3ROb2RlIH0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7XHJcbiAgQW5pbWF0ZWQsXHJcbiAgU2Nyb2xsVmlldyxcclxuICBTdHlsZVNoZWV0LFxyXG4gIFRleHRJbnB1dCxcclxuICBWaWV3LFxyXG4gIFZpZXdTdHlsZVxyXG59IGZyb20gXCJyZWFjdC1uYXRpdmVcIjtcclxuaW1wb3J0IHtcclxuICBDaXJjbGUsXHJcbiAgRyxcclxuICBQYXRoLFxyXG4gIFBvbHlnb24sXHJcbiAgUG9seWxpbmUsXHJcbiAgUmVjdCxcclxuICBTdmdcclxufSBmcm9tIFwicmVhY3QtbmF0aXZlLXN2Z1wiO1xyXG5cclxuaW1wb3J0IEFic3RyYWN0Q2hhcnQsIHtcclxuICBBYnN0cmFjdENoYXJ0Q29uZmlnLFxyXG4gIEFic3RyYWN0Q2hhcnRQcm9wc1xyXG59IGZyb20gXCIuLi9BYnN0cmFjdENoYXJ0XCI7XHJcbmltcG9ydCB7IENoYXJ0RGF0YSwgRGF0YXNldCB9IGZyb20gXCIuLi9IZWxwZXJUeXBlc1wiO1xyXG5pbXBvcnQgeyBMZWdlbmRJdGVtIH0gZnJvbSBcIi4vTGVnZW5kSXRlbVwiO1xyXG5cclxubGV0IEFuaW1hdGVkQ2lyY2xlID0gQW5pbWF0ZWQuY3JlYXRlQW5pbWF0ZWRDb21wb25lbnQoQ2lyY2xlKTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGluZUNoYXJ0RGF0YSBleHRlbmRzIENoYXJ0RGF0YSB7XHJcbiAgbGVnZW5kPzogc3RyaW5nW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGluZUNoYXJ0UHJvcHMgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0UHJvcHMge1xyXG4gIC8qKlxyXG4gICAqIERhdGEgZm9yIHRoZSBjaGFydC5cclxuICAgKlxyXG4gICAqIEV4YW1wbGUgZnJvbSBbZG9jc10oaHR0cHM6Ly9naXRodWIuY29tL2luZGllc3Bpcml0L3JlYWN0LW5hdGl2ZS1jaGFydC1raXQjbGluZS1jaGFydCk6XHJcbiAgICpcclxuICAgKiBgYGBqYXZhc2NyaXB0XHJcbiAgICogY29uc3QgZGF0YSA9IHtcclxuICAgKiAgIGxhYmVsczogWydKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJywgJ0FwcmlsJywgJ01heScsICdKdW5lJ10sXHJcbiAgICogICBkYXRhc2V0czogW3tcclxuICAgKiAgICAgZGF0YTogWyAyMCwgNDUsIDI4LCA4MCwgOTksIDQzIF0sXHJcbiAgICogICAgIGNvbG9yOiAob3BhY2l0eSA9IDEpID0+IGByZ2JhKDEzNCwgNjUsIDI0NCwgJHtvcGFjaXR5fSlgLCAvLyBvcHRpb25hbFxyXG4gICAqICAgICBzdHJva2VXaWR0aDogMiAvLyBvcHRpb25hbFxyXG4gICAqICAgfV0sXHJcbiAgICogICBsZWdlbmQ6IFtcIlJhaW55IERheXNcIiwgXCJTdW5ueSBEYXlzXCIsIFwiU25vd3kgRGF5c1wiXSAvLyBvcHRpb25hbFxyXG4gICAqIH1cclxuICAgKiBgYGBcclxuICAgKi9cclxuICBkYXRhOiBMaW5lQ2hhcnREYXRhO1xyXG4gIC8qKlxyXG4gICAqIFdpZHRoIG9mIHRoZSBjaGFydCwgdXNlICdEaW1lbnNpb25zJyBsaWJyYXJ5IHRvIGdldCB0aGUgd2lkdGggb2YgeW91ciBzY3JlZW4gZm9yIHJlc3BvbnNpdmUuXHJcbiAgICovXHJcbiAgd2lkdGg6IG51bWJlcjtcclxuICAvKipcclxuICAgKiBIZWlnaHQgb2YgdGhlIGNoYXJ0LlxyXG4gICAqL1xyXG4gIGhlaWdodDogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIFNob3cgZG90cyBvbiB0aGUgbGluZSAtIGRlZmF1bHQ6IFRydWUuXHJcbiAgICovXHJcbiAgd2l0aERvdHM/OiBib29sZWFuO1xyXG4gIC8qKlxyXG4gICAqIFNob3cgc2hhZG93IGZvciBsaW5lIC0gZGVmYXVsdDogVHJ1ZS5cclxuICAgKi9cclxuICB3aXRoU2hhZG93PzogYm9vbGVhbjtcclxuICAvKipcclxuICAgKiBTaG93IGlubmVyIGRhc2hlZCBsaW5lcyAtIGRlZmF1bHQ6IFRydWUuXHJcbiAgICovXHJcblxyXG4gIHdpdGhTY3JvbGxhYmxlRG90PzogYm9vbGVhbjtcclxuICB3aXRoSW5uZXJMaW5lcz86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogU2hvdyBvdXRlciBkYXNoZWQgbGluZXMgLSBkZWZhdWx0OiBUcnVlLlxyXG4gICAqL1xyXG4gIHdpdGhPdXRlckxpbmVzPzogYm9vbGVhbjtcclxuICAvKipcclxuICAgKiBTaG93IHZlcnRpY2FsIGxpbmVzIC0gZGVmYXVsdDogVHJ1ZS5cclxuICAgKi9cclxuICB3aXRoVmVydGljYWxMaW5lcz86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogU2hvdyBob3Jpem9udGFsIGxpbmVzIC0gZGVmYXVsdDogVHJ1ZS5cclxuICAgKi9cclxuICB3aXRoSG9yaXpvbnRhbExpbmVzPzogYm9vbGVhbjtcclxuICAvKipcclxuICAgKiBTaG93IHZlcnRpY2FsIGxhYmVscyAtIGRlZmF1bHQ6IFRydWUuXHJcbiAgICovXHJcbiAgd2l0aFZlcnRpY2FsTGFiZWxzPzogYm9vbGVhbjtcclxuICAvKipcclxuICAgKiBTaG93IGhvcml6b250YWwgbGFiZWxzIC0gZGVmYXVsdDogVHJ1ZS5cclxuICAgKi9cclxuICB3aXRoSG9yaXpvbnRhbExhYmVscz86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogUmVuZGVyIGNoYXJ0cyBmcm9tIDAgbm90IGZyb20gdGhlIG1pbmltdW0gdmFsdWUuIC0gZGVmYXVsdDogRmFsc2UuXHJcbiAgICovXHJcbiAgZnJvbVplcm8/OiBib29sZWFuO1xyXG4gIC8qKlxyXG4gICAqIFByZXBlbmQgdGV4dCB0byBob3Jpem9udGFsIGxhYmVscyAtLSBkZWZhdWx0OiAnJy5cclxuICAgKi9cclxuICB5QXhpc0xhYmVsPzogc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIEFwcGVuZCB0ZXh0IHRvIGhvcml6b250YWwgbGFiZWxzIC0tIGRlZmF1bHQ6ICcnLlxyXG4gICAqL1xyXG4gIHlBeGlzU3VmZml4Pzogc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIFByZXBlbmQgdGV4dCB0byB2ZXJ0aWNhbCBsYWJlbHMgLS0gZGVmYXVsdDogJycuXHJcbiAgICovXHJcbiAgeEF4aXNMYWJlbD86IHN0cmluZztcclxuICAvKipcclxuICAgKiBDb25maWd1cmF0aW9uIG9iamVjdCBmb3IgdGhlIGNoYXJ0LCBzZWUgZXhhbXBsZTpcclxuICAgKlxyXG4gICAqIGBgYGphdmFzY3JpcHRcclxuICAgKiBjb25zdCBjaGFydENvbmZpZyA9IHtcclxuICAgKiAgIGJhY2tncm91bmRHcmFkaWVudEZyb206IFwiIzFFMjkyM1wiLFxyXG4gICAqICAgYmFja2dyb3VuZEdyYWRpZW50RnJvbU9wYWNpdHk6IDAsXHJcbiAgICogICBiYWNrZ3JvdW5kR3JhZGllbnRUbzogXCIjMDgxMzBEXCIsXHJcbiAgICogICBiYWNrZ3JvdW5kR3JhZGllbnRUb09wYWNpdHk6IDAuNSxcclxuICAgKiAgIGNvbG9yOiAob3BhY2l0eSA9IDEpID0+IGByZ2JhKDI2LCAyNTUsIDE0NiwgJHtvcGFjaXR5fSlgLFxyXG4gICAqICAgbGFiZWxDb2xvcjogKG9wYWNpdHkgPSAxKSA9PiBgcmdiYSgyNiwgMjU1LCAxNDYsICR7b3BhY2l0eX0pYCxcclxuICAgKiAgIHN0cm9rZVdpZHRoOiAyLCAvLyBvcHRpb25hbCwgZGVmYXVsdCAzXHJcbiAgICogICBiYXJQZXJjZW50YWdlOiAwLjVcclxuICAgKiB9O1xyXG4gICAqIGBgYFxyXG4gICAqL1xyXG4gIGNoYXJ0Q29uZmlnPzogQWJzdHJhY3RDaGFydENvbmZpZztcclxuXHJcbiAgLyoqXHJcbiAgICogRGl2aWRlIGF4aXMgcXVhbnRpdHkgYnkgdGhlIGlucHV0IG51bWJlciAtLSBkZWZhdWx0OiAxLlxyXG4gICAqL1xyXG4gIHlBeGlzSW50ZXJ2YWw/OiBudW1iZXI7XHJcblxyXG4gIC8qKlxyXG4gICAqIERlZmluZXMgaWYgY2hhcnQgaXMgdHJhbnNwYXJlbnRcclxuICAgKi9cclxuICB0cmFuc3BhcmVudD86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogVGhpcyBmdW5jdGlvbiB0YWtlcyBhIFt3aG9sZSBidW5jaF0oaHR0cHM6Ly9naXRodWIuY29tL2luZGllc3Bpcml0L3JlYWN0LW5hdGl2ZS1jaGFydC1raXQvYmxvYi9tYXN0ZXIvc3JjL2xpbmUtY2hhcnQuanMjTDI2NilcclxuICAgKiBvZiBzdHVmZiBhbmQgY2FuIHJlbmRlciBleHRyYSBlbGVtZW50cyxcclxuICAgKiBzdWNoIGFzIGRhdGEgcG9pbnQgaW5mbyBvciBhZGRpdGlvbmFsIG1hcmt1cC5cclxuICAgKi9cclxuICBkZWNvcmF0b3I/OiBGdW5jdGlvbjtcclxuICAvKipcclxuICAgKiBDYWxsYmFjayB0aGF0IGlzIGNhbGxlZCB3aGVuIGEgZGF0YSBwb2ludCBpcyBjbGlja2VkLlxyXG4gICAqL1xyXG4gIG9uRGF0YVBvaW50Q2xpY2s/OiAoZGF0YToge1xyXG4gICAgaW5kZXg6IG51bWJlcjtcclxuICAgIHZhbHVlOiBudW1iZXI7XHJcbiAgICBkYXRhc2V0OiBEYXRhc2V0O1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgZ2V0Q29sb3I6IChvcGFjaXR5OiBudW1iZXIpID0+IHN0cmluZztcclxuICB9KSA9PiB2b2lkO1xyXG4gIC8qKlxyXG4gICAqIFN0eWxlIG9mIHRoZSBjb250YWluZXIgdmlldyBvZiB0aGUgY2hhcnQuXHJcbiAgICovXHJcbiAgc3R5bGU/OiBQYXJ0aWFsPFZpZXdTdHlsZT47XHJcbiAgLyoqXHJcbiAgICogQWRkIHRoaXMgcHJvcCB0byBtYWtlIHRoZSBsaW5lIGNoYXJ0IHNtb290aCBhbmQgY3VydnkuXHJcbiAgICpcclxuICAgKiBbRXhhbXBsZV0oaHR0cHM6Ly9naXRodWIuY29tL2luZGllc3Bpcml0L3JlYWN0LW5hdGl2ZS1jaGFydC1raXQjYmV6aWVyLWxpbmUtY2hhcnQpXHJcbiAgICovXHJcbiAgYmV6aWVyPzogYm9vbGVhbjtcclxuICAvKipcclxuICAgKiBEZWZpbmVzIHRoZSBkb3QgY29sb3IgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIGNhbGN1bGF0ZSBjb2xvcnMgb2YgZG90cyBpbiBhIGxpbmUgY2hhcnQuXHJcbiAgICogVGFrZXMgYChkYXRhUG9pbnQsIGRhdGFQb2ludEluZGV4KWAgYXMgYXJndW1lbnRzLlxyXG4gICAqL1xyXG4gIGdldERvdENvbG9yPzogKGRhdGFQb2ludDogYW55LCBpbmRleDogbnVtYmVyKSA9PiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogUmVuZGVycyBhZGRpdGlvbmFsIGNvbnRlbnQgZm9yIGRvdHMgaW4gYSBsaW5lIGNoYXJ0LlxyXG4gICAqIFRha2VzIGAoe3gsIHksIGluZGV4fSlgIGFzIGFyZ3VtZW50cy5cclxuICAgKi9cclxuICByZW5kZXJEb3RDb250ZW50PzogKHBhcmFtczoge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgaW5kZXg6IG51bWJlcjtcclxuICAgIGluZGV4RGF0YTogbnVtYmVyO1xyXG4gIH0pID0+IFJlYWN0LlJlYWN0Tm9kZTtcclxuICAvKipcclxuICAgKiBSb3RhdGlvbiBhbmdsZSBvZiB0aGUgaG9yaXpvbnRhbCBsYWJlbHMgLSBkZWZhdWx0IDAgKGRlZ3JlZXMpLlxyXG4gICAqL1xyXG4gIGhvcml6b250YWxMYWJlbFJvdGF0aW9uPzogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIFJvdGF0aW9uIGFuZ2xlIG9mIHRoZSB2ZXJ0aWNhbCBsYWJlbHMgLSBkZWZhdWx0IDAgKGRlZ3JlZXMpLlxyXG4gICAqL1xyXG4gIHZlcnRpY2FsTGFiZWxSb3RhdGlvbj86IG51bWJlcjtcclxuICAvKipcclxuICAgKiBPZmZzZXQgZm9yIFkgYXhpcyBsYWJlbHMuXHJcbiAgICovXHJcbiAgeUxhYmVsc09mZnNldD86IG51bWJlcjtcclxuICAvKipcclxuICAgKiBPZmZzZXQgZm9yIFggYXhpcyBsYWJlbHMuXHJcbiAgICovXHJcbiAgeExhYmVsc09mZnNldD86IG51bWJlcjtcclxuICAvKipcclxuICAgKiBBcnJheSBvZiBpbmRpY2VzIG9mIHRoZSBkYXRhIHBvaW50cyB5b3UgZG9uJ3Qgd2FudCB0byBkaXNwbGF5LlxyXG4gICAqL1xyXG4gIGhpZGVQb2ludHNBdEluZGV4PzogbnVtYmVyW107XHJcbiAgLyoqXHJcbiAgICogVGhpcyBmdW5jdGlvbiBjaGFuZ2UgdGhlIGZvcm1hdCBvZiB0aGUgZGlzcGxheSB2YWx1ZSBvZiB0aGUgWSBsYWJlbC5cclxuICAgKiBUYWtlcyB0aGUgeSB2YWx1ZSBhcyBhcmd1bWVudCBhbmQgc2hvdWxkIHJldHVybiB0aGUgZGVzaXJhYmxlIHN0cmluZy5cclxuICAgKi9cclxuICBmb3JtYXRZTGFiZWw/OiAoeVZhbHVlOiBzdHJpbmcpID0+IHN0cmluZztcclxuICAvKipcclxuICAgKiBUaGlzIGZ1bmN0aW9uIGNoYW5nZSB0aGUgZm9ybWF0IG9mIHRoZSBkaXNwbGF5IHZhbHVlIG9mIHRoZSBYIGxhYmVsLlxyXG4gICAqIFRha2VzIHRoZSBYIHZhbHVlIGFzIGFyZ3VtZW50IGFuZCBzaG91bGQgcmV0dXJuIHRoZSBkZXNpcmFibGUgc3RyaW5nLlxyXG4gICAqL1xyXG4gIGZvcm1hdFhMYWJlbD86ICh4VmFsdWU6IHN0cmluZykgPT4gc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIFByb3ZpZGUgcHJvcHMgZm9yIGEgZGF0YSBwb2ludCBkb3QuXHJcbiAgICovXHJcbiAgZ2V0RG90UHJvcHM/OiAoZGF0YVBvaW50OiBhbnksIGluZGV4OiBudW1iZXIpID0+IG9iamVjdDtcclxuICAvKipcclxuICAgKiBUaGUgbnVtYmVyIG9mIGhvcml6b250YWwgbGluZXNcclxuICAgKi9cclxuICBzZWdtZW50cz86IG51bWJlcjtcclxufVxyXG5cclxudHlwZSBMaW5lQ2hhcnRTdGF0ZSA9IHtcclxuICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldDogQW5pbWF0ZWQuVmFsdWU7XHJcbn07XHJcblxyXG5jbGFzcyBMaW5lQ2hhcnQgZXh0ZW5kcyBBYnN0cmFjdENoYXJ0PExpbmVDaGFydFByb3BzLCBMaW5lQ2hhcnRTdGF0ZT4ge1xyXG4gIGxhYmVsID0gUmVhY3QuY3JlYXRlUmVmPFRleHRJbnB1dD4oKTtcclxuXHJcbiAgc3RhdGUgPSB7XHJcbiAgICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldDogbmV3IEFuaW1hdGVkLlZhbHVlKDApXHJcbiAgfTtcclxuXHJcbiAgZ2V0Q29sb3IgPSAoZGF0YXNldDogRGF0YXNldCwgb3BhY2l0eTogbnVtYmVyKSA9PiB7XHJcbiAgICByZXR1cm4gKGRhdGFzZXQuY29sb3IgfHwgdGhpcy5wcm9wcy5jaGFydENvbmZpZy5jb2xvcikob3BhY2l0eSk7XHJcbiAgfTtcclxuXHJcbiAgZ2V0U3Ryb2tlV2lkdGggPSAoZGF0YXNldDogRGF0YXNldCkgPT4ge1xyXG4gICAgcmV0dXJuIGRhdGFzZXQuc3Ryb2tlV2lkdGggfHwgdGhpcy5wcm9wcy5jaGFydENvbmZpZy5zdHJva2VXaWR0aCB8fCAzO1xyXG4gIH07XHJcblxyXG4gIGdldERhdGFzID0gKGRhdGE6IERhdGFzZXRbXSk6IG51bWJlcltdID0+IHtcclxuICAgIHJldHVybiBkYXRhLnJlZHVjZShcclxuICAgICAgKGFjYywgaXRlbSkgPT4gKGl0ZW0uZGF0YSA/IFsuLi5hY2MsIC4uLml0ZW0uZGF0YV0gOiBhY2MpLFxyXG4gICAgICBbXVxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICBnZXRQcm9wc0ZvckRvdHMgPSAoeDogYW55LCBpOiBudW1iZXIpID0+IHtcclxuICAgIGNvbnN0IHsgZ2V0RG90UHJvcHMsIGNoYXJ0Q29uZmlnIH0gPSB0aGlzLnByb3BzO1xyXG5cclxuICAgIGlmICh0eXBlb2YgZ2V0RG90UHJvcHMgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICByZXR1cm4gZ2V0RG90UHJvcHMoeCwgaSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgeyBwcm9wc0ZvckRvdHMgPSB7fSB9ID0gY2hhcnRDb25maWc7XHJcblxyXG4gICAgcmV0dXJuIHsgcjogXCI0XCIsIC4uLnByb3BzRm9yRG90cyB9O1xyXG4gIH07XHJcblxyXG4gIHJlbmRlckRvdHMgPSAoe1xyXG4gICAgZGF0YSxcclxuICAgIHdpZHRoLFxyXG4gICAgaGVpZ2h0LFxyXG4gICAgcGFkZGluZ1RvcCxcclxuICAgIHBhZGRpbmdSaWdodCxcclxuICAgIG9uRGF0YVBvaW50Q2xpY2tcclxuICB9OiBQaWNrPFxyXG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcclxuICAgIFwiZGF0YVwiIHwgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIlxyXG4gID4gJiB7XHJcbiAgICBvbkRhdGFQb2ludENsaWNrOiBMaW5lQ2hhcnRQcm9wc1tcIm9uRGF0YVBvaW50Q2xpY2tcIl07XHJcbiAgfSkgPT4ge1xyXG4gICAgY29uc3Qgb3V0cHV0OiBSZWFjdE5vZGVbXSA9IFtdO1xyXG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xyXG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XHJcblxyXG4gICAgY29uc3Qge1xyXG4gICAgICBnZXREb3RDb2xvcixcclxuICAgICAgaGlkZVBvaW50c0F0SW5kZXggPSBbXSxcclxuICAgICAgcmVuZGVyRG90Q29udGVudCA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfSA9IHRoaXMucHJvcHM7XHJcblxyXG4gICAgZGF0YS5mb3JFYWNoKGRhdGFzZXQgPT4ge1xyXG4gICAgICBpZiAoZGF0YXNldC53aXRoRG90cyA9PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgZGF0YXNldC5kYXRhLmZvckVhY2goKHgsIGkpID0+IHtcclxuICAgICAgICBpZiAoaGlkZVBvaW50c0F0SW5kZXguaW5jbHVkZXMoaSkpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNodW5rcyA9IGRhdGFzZXQuZGF0YS5sZW5ndGggPT0gMSA/IDEgOiBkYXRhc2V0LmRhdGEubGVuZ3RoIC0gMTtcclxuICAgICAgICBjb25zdCBjeCA9IHBhZGRpbmdSaWdodCArIChpICogKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSkgLyBjaHVua3MgLSA1O1xyXG5cclxuICAgICAgICBjb25zdCBjeSA9XHJcbiAgICAgICAgICAoKGJhc2VIZWlnaHQgLSB0aGlzLmNhbGNIZWlnaHQoeCwgZGF0YXMsIGhlaWdodCkpIC8gNCkgKiAzICtcclxuICAgICAgICAgIHBhZGRpbmdUb3A7XHJcblxyXG4gICAgICAgIGNvbnN0IG9uUHJlc3MgPSAoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoIW9uRGF0YVBvaW50Q2xpY2sgfHwgaGlkZVBvaW50c0F0SW5kZXguaW5jbHVkZXMoaSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIG9uRGF0YVBvaW50Q2xpY2soe1xyXG4gICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgdmFsdWU6IHgsXHJcbiAgICAgICAgICAgIGRhdGFzZXQsXHJcbiAgICAgICAgICAgIHg6IGN4LFxyXG4gICAgICAgICAgICB5OiBjeSxcclxuICAgICAgICAgICAgZ2V0Q29sb3I6IG9wYWNpdHkgPT4gdGhpcy5nZXRDb2xvcihkYXRhc2V0LCBvcGFjaXR5KVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgb3V0cHV0LnB1c2goXHJcbiAgICAgICAgICA8Q2lyY2xlXHJcbiAgICAgICAgICAgIGtleT17TWF0aC5yYW5kb20oKX1cclxuICAgICAgICAgICAgY3g9e2N4fVxyXG4gICAgICAgICAgICBjeT17Y3l9XHJcbiAgICAgICAgICAgIGZpbGw9e1xyXG4gICAgICAgICAgICAgIHR5cGVvZiBnZXREb3RDb2xvciA9PT0gXCJmdW5jdGlvblwiXHJcbiAgICAgICAgICAgICAgICA/IGdldERvdENvbG9yKHgsIGkpXHJcbiAgICAgICAgICAgICAgICA6IHRoaXMuZ2V0Q29sb3IoZGF0YXNldCwgMC45KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9uUHJlc3M9e29uUHJlc3N9XHJcbiAgICAgICAgICAgIHsuLi50aGlzLmdldFByb3BzRm9yRG90cyh4LCBpKX1cclxuICAgICAgICAgIC8+LFxyXG4gICAgICAgICAgPENpcmNsZVxyXG4gICAgICAgICAgICBrZXk9e01hdGgucmFuZG9tKCl9XHJcbiAgICAgICAgICAgIGN4PXtjeH1cclxuICAgICAgICAgICAgY3k9e2N5fVxyXG4gICAgICAgICAgICByPVwiMTRcIlxyXG4gICAgICAgICAgICBmaWxsPVwiI2ZmZlwiXHJcbiAgICAgICAgICAgIGZpbGxPcGFjaXR5PXswfVxyXG4gICAgICAgICAgICBvblByZXNzPXtvblByZXNzfVxyXG4gICAgICAgICAgLz4sXHJcbiAgICAgICAgICByZW5kZXJEb3RDb250ZW50KHsgeDogY3gsIHk6IGN5LCBpbmRleDogaSwgaW5kZXhEYXRhOiB4IH0pXHJcbiAgICAgICAgKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG4gIH07XHJcblxyXG4gIHJlbmRlclNjcm9sbGFibGVEb3QgPSAoe1xyXG4gICAgZGF0YSxcclxuICAgIHdpZHRoLFxyXG4gICAgaGVpZ2h0LFxyXG4gICAgcGFkZGluZ1RvcCxcclxuICAgIHBhZGRpbmdSaWdodCxcclxuICAgIHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0LFxyXG4gICAgc2Nyb2xsYWJsZURvdEZpbGwsXHJcbiAgICBzY3JvbGxhYmxlRG90U3Ryb2tlQ29sb3IsXHJcbiAgICBzY3JvbGxhYmxlRG90U3Ryb2tlV2lkdGgsXHJcbiAgICBzY3JvbGxhYmxlRG90UmFkaXVzLFxyXG4gICAgc2Nyb2xsYWJsZUluZm9WaWV3U3R5bGUsXHJcbiAgICBzY3JvbGxhYmxlSW5mb1RleHRTdHlsZSxcclxuICAgIHNjcm9sbGFibGVJbmZvVGV4dERlY29yYXRvciA9IHggPT4gYCR7eH1gLFxyXG4gICAgc2Nyb2xsYWJsZUluZm9TaXplLFxyXG4gICAgc2Nyb2xsYWJsZUluZm9PZmZzZXRcclxuICB9OiBBYnN0cmFjdENoYXJ0Q29uZmlnICYge1xyXG4gICAgb25EYXRhUG9pbnRDbGljazogTGluZUNoYXJ0UHJvcHNbXCJvbkRhdGFQb2ludENsaWNrXCJdO1xyXG4gICAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQ6IEFuaW1hdGVkLlZhbHVlO1xyXG4gIH0pID0+IHtcclxuICAgIGNvbnN0IG91dHB1dCA9IFtdO1xyXG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xyXG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XHJcblxyXG4gICAgbGV0IHZsOiBudW1iZXJbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0IHBlckRhdGEgPSB3aWR0aCAvIGRhdGFbMF0uZGF0YS5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgZGF0YVswXS5kYXRhLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICB2bC5wdXNoKGluZGV4ICogcGVyRGF0YSk7XHJcbiAgICB9XHJcbiAgICBsZXQgbGFzdEluZGV4OiBudW1iZXI7XHJcblxyXG4gICAgc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuYWRkTGlzdGVuZXIodmFsdWUgPT4ge1xyXG4gICAgICBjb25zdCBpbmRleCA9IHZhbHVlLnZhbHVlIC8gcGVyRGF0YTtcclxuICAgICAgaWYgKCFsYXN0SW5kZXgpIHtcclxuICAgICAgICBsYXN0SW5kZXggPSBpbmRleDtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGFicyA9IE1hdGguZmxvb3IoaW5kZXgpO1xyXG4gICAgICBsZXQgcGVyY2VudCA9IGluZGV4IC0gYWJzO1xyXG4gICAgICBhYnMgPSBkYXRhWzBdLmRhdGEubGVuZ3RoIC0gYWJzIC0gMTtcclxuXHJcbiAgICAgIGlmIChpbmRleCA+PSBkYXRhWzBdLmRhdGEubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XHJcbiAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoTWF0aC5mbG9vcihkYXRhWzBdLmRhdGFbMF0pKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpbmRleCA+IGxhc3RJbmRleCkge1xyXG4gICAgICAgICAgLy8gdG8gcmlnaHRcclxuXHJcbiAgICAgICAgICBjb25zdCBiYXNlID0gZGF0YVswXS5kYXRhW2Fic107XHJcbiAgICAgICAgICBjb25zdCBwcmV2ID0gZGF0YVswXS5kYXRhW2FicyAtIDFdO1xyXG4gICAgICAgICAgaWYgKHByZXYgPiBiYXNlKSB7XHJcbiAgICAgICAgICAgIGxldCByZXN0ID0gcHJldiAtIGJhc2U7XHJcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XHJcbiAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihiYXNlICsgcGVyY2VudCAqIHJlc3QpXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCByZXN0ID0gYmFzZSAtIHByZXY7XHJcbiAgICAgICAgICAgIHRoaXMubGFiZWwuY3VycmVudC5zZXROYXRpdmVQcm9wcyh7XHJcbiAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5mbG9vcihiYXNlIC0gcGVyY2VudCAqIHJlc3QpXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gdG8gbGVmdFxyXG5cclxuICAgICAgICAgIGNvbnN0IGJhc2UgPSBkYXRhWzBdLmRhdGFbYWJzIC0gMV07XHJcbiAgICAgICAgICBjb25zdCBuZXh0ID0gZGF0YVswXS5kYXRhW2Fic107XHJcbiAgICAgICAgICBwZXJjZW50ID0gMSAtIHBlcmNlbnQ7XHJcbiAgICAgICAgICBpZiAobmV4dCA+IGJhc2UpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3QgPSBuZXh0IC0gYmFzZTtcclxuICAgICAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcclxuICAgICAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoXHJcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGJhc2UgKyBwZXJjZW50ICogcmVzdClcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHJlc3QgPSBiYXNlIC0gbmV4dDtcclxuICAgICAgICAgICAgdGhpcy5sYWJlbC5jdXJyZW50LnNldE5hdGl2ZVByb3BzKHtcclxuICAgICAgICAgICAgICB0ZXh0OiBzY3JvbGxhYmxlSW5mb1RleHREZWNvcmF0b3IoXHJcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGJhc2UgLSBwZXJjZW50ICogcmVzdClcclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBsYXN0SW5kZXggPSBpbmRleDtcclxuICAgIH0pO1xyXG5cclxuICAgIGRhdGEuZm9yRWFjaChkYXRhc2V0ID0+IHtcclxuICAgICAgaWYgKGRhdGFzZXQud2l0aFNjcm9sbGFibGVEb3QgPT0gZmFsc2UpIHJldHVybjtcclxuXHJcbiAgICAgIGNvbnN0IHBlckRhdGEgPSB3aWR0aCAvIGRhdGFzZXQuZGF0YS5sZW5ndGg7XHJcbiAgICAgIGxldCB2YWx1ZXMgPSBbXTtcclxuICAgICAgbGV0IHlWYWx1ZXMgPSBbXTtcclxuICAgICAgbGV0IHhWYWx1ZXMgPSBbXTtcclxuXHJcbiAgICAgIGxldCB5VmFsdWVzTGFiZWwgPSBbXTtcclxuICAgICAgbGV0IHhWYWx1ZXNMYWJlbCA9IFtdO1xyXG5cclxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGRhdGFzZXQuZGF0YS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICB2YWx1ZXMucHVzaChpbmRleCAqIHBlckRhdGEpO1xyXG4gICAgICAgIGNvbnN0IHl2YWwgPVxyXG4gICAgICAgICAgKChiYXNlSGVpZ2h0IC1cclxuICAgICAgICAgICAgdGhpcy5jYWxjSGVpZ2h0KFxyXG4gICAgICAgICAgICAgIGRhdGFzZXQuZGF0YVtkYXRhc2V0LmRhdGEubGVuZ3RoIC0gaW5kZXggLSAxXSxcclxuICAgICAgICAgICAgICBkYXRhcyxcclxuICAgICAgICAgICAgICBoZWlnaHRcclxuICAgICAgICAgICAgKSkgL1xyXG4gICAgICAgICAgICA0KSAqXHJcbiAgICAgICAgICAgIDMgK1xyXG4gICAgICAgICAgcGFkZGluZ1RvcDtcclxuICAgICAgICB5VmFsdWVzLnB1c2goeXZhbCk7XHJcbiAgICAgICAgY29uc3QgeHZhbCA9XHJcbiAgICAgICAgICBwYWRkaW5nUmlnaHQgK1xyXG4gICAgICAgICAgKChkYXRhc2V0LmRhdGEubGVuZ3RoIC0gaW5kZXggLSAxKSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC9cclxuICAgICAgICAgICAgZGF0YXNldC5kYXRhLmxlbmd0aDtcclxuICAgICAgICB4VmFsdWVzLnB1c2goeHZhbCk7XHJcblxyXG4gICAgICAgIHlWYWx1ZXNMYWJlbC5wdXNoKFxyXG4gICAgICAgICAgeXZhbCAtIChzY3JvbGxhYmxlSW5mb1NpemUuaGVpZ2h0ICsgc2Nyb2xsYWJsZUluZm9PZmZzZXQpXHJcbiAgICAgICAgKTtcclxuICAgICAgICB4VmFsdWVzTGFiZWwucHVzaCh4dmFsIC0gc2Nyb2xsYWJsZUluZm9TaXplLndpZHRoIC8gMik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZVggPSBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldC5pbnRlcnBvbGF0ZSh7XHJcbiAgICAgICAgaW5wdXRSYW5nZTogdmFsdWVzLFxyXG4gICAgICAgIG91dHB1dFJhbmdlOiB4VmFsdWVzLFxyXG4gICAgICAgIGV4dHJhcG9sYXRlOiBcImNsYW1wXCJcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCB0cmFuc2xhdGVZID0gc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuaW50ZXJwb2xhdGUoe1xyXG4gICAgICAgIGlucHV0UmFuZ2U6IHZhbHVlcyxcclxuICAgICAgICBvdXRwdXRSYW5nZTogeVZhbHVlcyxcclxuICAgICAgICBleHRyYXBvbGF0ZTogXCJjbGFtcFwiXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgY29uc3QgbGFiZWxUcmFuc2xhdGVYID0gc2Nyb2xsYWJsZURvdEhvcml6b250YWxPZmZzZXQuaW50ZXJwb2xhdGUoe1xyXG4gICAgICAgIGlucHV0UmFuZ2U6IHZhbHVlcyxcclxuICAgICAgICBvdXRwdXRSYW5nZTogeFZhbHVlc0xhYmVsLFxyXG4gICAgICAgIGV4dHJhcG9sYXRlOiBcImNsYW1wXCJcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBsYWJlbFRyYW5zbGF0ZVkgPSBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldC5pbnRlcnBvbGF0ZSh7XHJcbiAgICAgICAgaW5wdXRSYW5nZTogdmFsdWVzLFxyXG4gICAgICAgIG91dHB1dFJhbmdlOiB5VmFsdWVzTGFiZWwsXHJcbiAgICAgICAgZXh0cmFwb2xhdGU6IFwiY2xhbXBcIlxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIG91dHB1dC5wdXNoKFtcclxuICAgICAgICA8QW5pbWF0ZWQuVmlld1xyXG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxyXG4gICAgICAgICAgc3R5bGU9e1tcclxuICAgICAgICAgICAgc2Nyb2xsYWJsZUluZm9WaWV3U3R5bGUsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICB0cmFuc2Zvcm06IFtcclxuICAgICAgICAgICAgICAgIHsgdHJhbnNsYXRlWDogbGFiZWxUcmFuc2xhdGVYIH0sXHJcbiAgICAgICAgICAgICAgICB7IHRyYW5zbGF0ZVk6IGxhYmVsVHJhbnNsYXRlWSB9XHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICB3aWR0aDogc2Nyb2xsYWJsZUluZm9TaXplLndpZHRoLFxyXG4gICAgICAgICAgICAgIGhlaWdodDogc2Nyb2xsYWJsZUluZm9TaXplLmhlaWdodFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdfVxyXG4gICAgICAgID5cclxuICAgICAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICAgICAgb25MYXlvdXQ9eygpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmxhYmVsLmN1cnJlbnQuc2V0TmF0aXZlUHJvcHMoe1xyXG4gICAgICAgICAgICAgICAgdGV4dDogc2Nyb2xsYWJsZUluZm9UZXh0RGVjb3JhdG9yKFxyXG4gICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKGRhdGFbMF0uZGF0YVtkYXRhWzBdLmRhdGEubGVuZ3RoIC0gMV0pXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIHN0eWxlPXtzY3JvbGxhYmxlSW5mb1RleHRTdHlsZX1cclxuICAgICAgICAgICAgcmVmPXt0aGlzLmxhYmVsfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L0FuaW1hdGVkLlZpZXc+LFxyXG4gICAgICAgIDxBbmltYXRlZENpcmNsZVxyXG4gICAgICAgICAga2V5PXtNYXRoLnJhbmRvbSgpfVxyXG4gICAgICAgICAgY3g9e3RyYW5zbGF0ZVh9XHJcbiAgICAgICAgICBjeT17dHJhbnNsYXRlWX1cclxuICAgICAgICAgIHI9e3Njcm9sbGFibGVEb3RSYWRpdXN9XHJcbiAgICAgICAgICBzdHJva2U9e3Njcm9sbGFibGVEb3RTdHJva2VDb2xvcn1cclxuICAgICAgICAgIHN0cm9rZVdpZHRoPXtzY3JvbGxhYmxlRG90U3Ryb2tlV2lkdGh9XHJcbiAgICAgICAgICBmaWxsPXtzY3JvbGxhYmxlRG90RmlsbH1cclxuICAgICAgICAvPlxyXG4gICAgICBdKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgfTtcclxuXHJcbiAgcmVuZGVyU2hhZG93ID0gKHtcclxuICAgIHdpZHRoLFxyXG4gICAgaGVpZ2h0LFxyXG4gICAgcGFkZGluZ1JpZ2h0LFxyXG4gICAgcGFkZGluZ1RvcCxcclxuICAgIGRhdGEsXHJcbiAgICB1c2VDb2xvckZyb21EYXRhc2V0XHJcbiAgfTogUGljazxcclxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXHJcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcclxuICA+ICYge1xyXG4gICAgdXNlQ29sb3JGcm9tRGF0YXNldDogQWJzdHJhY3RDaGFydENvbmZpZ1tcInVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXRcIl07XHJcbiAgfSkgPT4ge1xyXG4gICAgaWYgKHRoaXMucHJvcHMuYmV6aWVyKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckJlemllclNoYWRvdyh7XHJcbiAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgIHBhZGRpbmdSaWdodCxcclxuICAgICAgICBwYWRkaW5nVG9wLFxyXG4gICAgICAgIGRhdGEsXHJcbiAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YSk7XHJcbiAgICBjb25zdCBiYXNlSGVpZ2h0ID0gdGhpcy5jYWxjQmFzZUhlaWdodChkYXRhcywgaGVpZ2h0KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YS5tYXAoKGRhdGFzZXQsIGluZGV4KSA9PiB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFBvbHlnb25cclxuICAgICAgICAgIGtleT17aW5kZXh9XHJcbiAgICAgICAgICBwb2ludHM9e1xyXG4gICAgICAgICAgICBkYXRhc2V0LmRhdGFcclxuICAgICAgICAgICAgICAubWFwKChkLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaHVua3MgPVxyXG4gICAgICAgICAgICAgICAgICBkYXRhc2V0LmRhdGEubGVuZ3RoID09IDEgPyAxIDogZGF0YXNldC5kYXRhLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB4ID1cclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0ICsgKGkgKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvIGNodW5rcyAtIDU7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgeSA9XHJcbiAgICAgICAgICAgICAgICAgICgoYmFzZUhlaWdodCAtIHRoaXMuY2FsY0hlaWdodChkLCBkYXRhcywgaGVpZ2h0KSkgLyA0KSAqIDMgK1xyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHt4fSwke3l9YDtcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIC5qb2luKFwiIFwiKSArXHJcbiAgICAgICAgICAgIGAgJHtwYWRkaW5nUmlnaHQgK1xyXG4gICAgICAgICAgICAgICgod2lkdGggLSBwYWRkaW5nUmlnaHQpIC8gZGF0YXNldC5kYXRhLmxlbmd0aCkgKlxyXG4gICAgICAgICAgICAgICAgKGRhdGFzZXQuZGF0YS5sZW5ndGggLSAxKX0sJHsoaGVpZ2h0IC8gNCkgKiAzICtcclxuICAgICAgICAgICAgICBwYWRkaW5nVG9wfSAke3BhZGRpbmdSaWdodH0sJHsoaGVpZ2h0IC8gNCkgKiAzICsgcGFkZGluZ1RvcH1gXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBmaWxsPXtgdXJsKCNmaWxsU2hhZG93R3JhZGllbnQke1xyXG4gICAgICAgICAgICB1c2VDb2xvckZyb21EYXRhc2V0ID8gYF8ke2luZGV4fWAgOiBcIlwiXHJcbiAgICAgICAgICB9KWB9XHJcbiAgICAgICAgICBzdHJva2VXaWR0aD17MH1cclxuICAgICAgICAvPlxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmVuZGVyTGluZSA9ICh7XHJcbiAgICB3aWR0aCxcclxuICAgIGhlaWdodCxcclxuICAgIHBhZGRpbmdSaWdodCxcclxuICAgIHBhZGRpbmdUb3AsXHJcbiAgICBkYXRhLFxyXG4gICAgbGluZWpvaW5UeXBlXHJcbiAgfTogUGljazxcclxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXHJcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCIgfCBcImxpbmVqb2luVHlwZVwiXHJcbiAgPikgPT4ge1xyXG4gICAgaWYgKHRoaXMucHJvcHMuYmV6aWVyKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckJlemllckxpbmUoe1xyXG4gICAgICAgIGRhdGEsXHJcbiAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgIHBhZGRpbmdSaWdodCxcclxuICAgICAgICBwYWRkaW5nVG9wXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG91dHB1dCA9IFtdO1xyXG4gICAgY29uc3QgZGF0YXMgPSB0aGlzLmdldERhdGFzKGRhdGEpO1xyXG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XHJcblxyXG4gICAgbGV0IGxhc3RQb2ludDogc3RyaW5nO1xyXG5cclxuICAgIGRhdGEuZm9yRWFjaCgoZGF0YXNldCwgaW5kZXgpID0+IHtcclxuICAgICAgY29uc3QgcG9pbnRzID0gZGF0YXNldC5kYXRhLm1hcCgoZCwgaSkgPT4ge1xyXG4gICAgICAgIGlmIChkID09PSBudWxsKSByZXR1cm4gbGFzdFBvaW50O1xyXG4gICAgICAgIGNvbnN0IGNodW5rcyA9IGRhdGFzZXQuZGF0YS5sZW5ndGggPT0gMSA/IDEgOiBkYXRhc2V0LmRhdGEubGVuZ3RoIC0gMTtcclxuICAgICAgICBjb25zdCB4ID0gKGkgKiAod2lkdGggLSBwYWRkaW5nUmlnaHQpKSAvIGNodW5rcyArIHBhZGRpbmdSaWdodCAtIDU7XHJcbiAgICAgICAgY29uc3QgeSA9XHJcbiAgICAgICAgICAoKGJhc2VIZWlnaHQgLSB0aGlzLmNhbGNIZWlnaHQoZCwgZGF0YXMsIGhlaWdodCkpIC8gNCkgKiAzICtcclxuICAgICAgICAgIHBhZGRpbmdUb3A7XHJcbiAgICAgICAgbGFzdFBvaW50ID0gYCR7eH0sJHt5fWA7XHJcbiAgICAgICAgcmV0dXJuIGAke3h9LCR7eX1gO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIG91dHB1dC5wdXNoKFxyXG4gICAgICAgIDxQb2x5bGluZVxyXG4gICAgICAgICAga2V5PXtpbmRleH1cclxuICAgICAgICAgIHN0cm9rZUxpbmVqb2luPXtsaW5lam9pblR5cGV9XHJcbiAgICAgICAgICBwb2ludHM9e3BvaW50cy5qb2luKFwiIFwiKX1cclxuICAgICAgICAgIGZpbGw9XCJub25lXCJcclxuICAgICAgICAgIHN0cm9rZT17dGhpcy5nZXRDb2xvcihkYXRhc2V0LCAwLjIpfVxyXG4gICAgICAgICAgc3Ryb2tlV2lkdGg9e3RoaXMuZ2V0U3Ryb2tlV2lkdGgoZGF0YXNldCl9XHJcbiAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9e2RhdGFzZXQuc3Ryb2tlRGFzaEFycmF5fVxyXG4gICAgICAgICAgc3Ryb2tlRGFzaG9mZnNldD17ZGF0YXNldC5zdHJva2VEYXNoT2Zmc2V0fVxyXG4gICAgICAgIC8+XHJcbiAgICAgICk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG4gIH07XHJcblxyXG4gIGdldEJlemllckxpbmVQb2ludHMgPSAoXHJcbiAgICBkYXRhc2V0OiBEYXRhc2V0LFxyXG4gICAge1xyXG4gICAgICB3aWR0aCxcclxuICAgICAgaGVpZ2h0LFxyXG4gICAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICAgIHBhZGRpbmdUb3AsXHJcbiAgICAgIGRhdGFcclxuICAgIH06IFBpY2s8XHJcbiAgICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXHJcbiAgICAgIFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCIgfCBcImRhdGFcIlxyXG4gICAgPlxyXG4gICkgPT4ge1xyXG4gICAgaWYgKGRhdGFzZXQuZGF0YS5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIFwiTTAsMFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGFzID0gdGhpcy5nZXREYXRhcyhkYXRhKTtcclxuXHJcbiAgICBjb25zdCBjaHVua3MgPSBkYXRhc2V0LmRhdGEubGVuZ3RoID09IDEgPyAxIDogZGF0YXNldC5kYXRhLmxlbmd0aCAtIDE7XHJcbiAgICBjb25zdCB4ID0gKGk6IG51bWJlcikgPT5cclxuICAgICAgTWF0aC5mbG9vcihwYWRkaW5nUmlnaHQgKyAoaSAqICh3aWR0aCAtIHBhZGRpbmdSaWdodCkpIC8gY2h1bmtzIC0gNSk7XHJcblxyXG4gICAgY29uc3QgYmFzZUhlaWdodCA9IHRoaXMuY2FsY0Jhc2VIZWlnaHQoZGF0YXMsIGhlaWdodCk7XHJcblxyXG4gICAgY29uc3QgeSA9IChpOiBudW1iZXIpID0+IHtcclxuICAgICAgY29uc3QgeUhlaWdodCA9IHRoaXMuY2FsY0hlaWdodChkYXRhc2V0LmRhdGFbaV0sIGRhdGFzLCBoZWlnaHQpO1xyXG5cclxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKChiYXNlSGVpZ2h0IC0geUhlaWdodCkgLyA0KSAqIDMgKyBwYWRkaW5nVG9wKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIFtgTSR7eCgwKX0sJHt5KDApfWBdXHJcbiAgICAgIC5jb25jYXQoXHJcbiAgICAgICAgZGF0YXNldC5kYXRhLnNsaWNlKDAsIC0xKS5tYXAoKF8sIGkpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHhfbWlkID0gKHgoaSkgKyB4KGkgKyAxKSkgLyAyO1xyXG4gICAgICAgICAgY29uc3QgeV9taWQgPSAoeShpKSArIHkoaSArIDEpKSAvIDI7XHJcbiAgICAgICAgICBjb25zdCBjcF94MSA9ICh4X21pZCArIHgoaSkpIC8gMjtcclxuICAgICAgICAgIGNvbnN0IGNwX3gyID0gKHhfbWlkICsgeChpICsgMSkpIC8gMjtcclxuICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIGBRICR7Y3BfeDF9LCAke3koaSl9LCAke3hfbWlkfSwgJHt5X21pZH1gICtcclxuICAgICAgICAgICAgYCBRICR7Y3BfeDJ9LCAke3koaSArIDEpfSwgJHt4KGkgKyAxKX0sICR7eShpICsgMSl9YFxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KVxyXG4gICAgICApXHJcbiAgICAgIC5qb2luKFwiIFwiKTtcclxuICB9O1xyXG5cclxuICByZW5kZXJCZXppZXJMaW5lID0gKHtcclxuICAgIGRhdGEsXHJcbiAgICB3aWR0aCxcclxuICAgIGhlaWdodCxcclxuICAgIHBhZGRpbmdSaWdodCxcclxuICAgIHBhZGRpbmdUb3BcclxuICB9OiBQaWNrPFxyXG4gICAgQWJzdHJhY3RDaGFydENvbmZpZyxcclxuICAgIFwiZGF0YVwiIHwgXCJ3aWR0aFwiIHwgXCJoZWlnaHRcIiB8IFwicGFkZGluZ1JpZ2h0XCIgfCBcInBhZGRpbmdUb3BcIlxyXG4gID4pID0+IHtcclxuICAgIHJldHVybiBkYXRhLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5nZXRCZXppZXJMaW5lUG9pbnRzKGRhdGFzZXQsIHtcclxuICAgICAgICB3aWR0aCxcclxuICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgcGFkZGluZ1JpZ2h0LFxyXG4gICAgICAgIHBhZGRpbmdUb3AsXHJcbiAgICAgICAgZGF0YVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFBhdGhcclxuICAgICAgICAgIGtleT17aW5kZXh9XHJcbiAgICAgICAgICBkPXtyZXN1bHR9XHJcbiAgICAgICAgICBmaWxsPVwibm9uZVwiXHJcbiAgICAgICAgICBzdHJva2U9e3RoaXMuZ2V0Q29sb3IoZGF0YXNldCwgMC4yKX1cclxuICAgICAgICAgIHN0cm9rZVdpZHRoPXt0aGlzLmdldFN0cm9rZVdpZHRoKGRhdGFzZXQpfVxyXG4gICAgICAgICAgc3Ryb2tlRGFzaGFycmF5PXtkYXRhc2V0LnN0cm9rZURhc2hBcnJheX1cclxuICAgICAgICAgIHN0cm9rZURhc2hvZmZzZXQ9e2RhdGFzZXQuc3Ryb2tlRGFzaE9mZnNldH1cclxuICAgICAgICAvPlxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmVuZGVyQmV6aWVyU2hhZG93ID0gKHtcclxuICAgIHdpZHRoLFxyXG4gICAgaGVpZ2h0LFxyXG4gICAgcGFkZGluZ1JpZ2h0LFxyXG4gICAgcGFkZGluZ1RvcCxcclxuICAgIGRhdGEsXHJcbiAgICB1c2VDb2xvckZyb21EYXRhc2V0XHJcbiAgfTogUGljazxcclxuICAgIEFic3RyYWN0Q2hhcnRDb25maWcsXHJcbiAgICBcImRhdGFcIiB8IFwid2lkdGhcIiB8IFwiaGVpZ2h0XCIgfCBcInBhZGRpbmdSaWdodFwiIHwgXCJwYWRkaW5nVG9wXCJcclxuICA+ICYge1xyXG4gICAgdXNlQ29sb3JGcm9tRGF0YXNldDogQWJzdHJhY3RDaGFydENvbmZpZ1tcInVzZVNoYWRvd0NvbG9yRnJvbURhdGFzZXRcIl07XHJcbiAgfSkgPT5cclxuICAgIGRhdGEubWFwKChkYXRhc2V0LCBpbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCBkID1cclxuICAgICAgICB0aGlzLmdldEJlemllckxpbmVQb2ludHMoZGF0YXNldCwge1xyXG4gICAgICAgICAgd2lkdGgsXHJcbiAgICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgICBwYWRkaW5nUmlnaHQsXHJcbiAgICAgICAgICBwYWRkaW5nVG9wLFxyXG4gICAgICAgICAgZGF0YVxyXG4gICAgICAgIH0pICtcclxuICAgICAgICBgIEwke3BhZGRpbmdSaWdodCArXHJcbiAgICAgICAgICAoKHdpZHRoIC0gcGFkZGluZ1JpZ2h0KSAvIGRhdGFzZXQuZGF0YS5sZW5ndGgpICogZGF0YXNldC5kYXRhLmxlbmd0aCAtXHJcbiAgICAgICAgICA1fSwkeyhoZWlnaHQgLyA0KSAqIDMgKyBwYWRkaW5nVG9wfSBMJHtwYWRkaW5nUmlnaHQgLSA1fSwkeyhoZWlnaHQgL1xyXG4gICAgICAgICAgNCkgKlxyXG4gICAgICAgICAgMyArXHJcbiAgICAgICAgICBwYWRkaW5nVG9wfSBaYDtcclxuXHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPFBhdGhcclxuICAgICAgICAgIGtleT17aW5kZXh9XHJcbiAgICAgICAgICBkPXtkfVxyXG4gICAgICAgICAgZmlsbD17YHVybCgjZmlsbFNoYWRvd0dyYWRpZW50JHtcclxuICAgICAgICAgICAgdXNlQ29sb3JGcm9tRGF0YXNldCA/IGBfJHtpbmRleH1gIDogXCJcIlxyXG4gICAgICAgICAgfSlgfVxyXG4gICAgICAgICAgc3Ryb2tlV2lkdGg9ezB9XHJcbiAgICAgICAgLz5cclxuICAgICAgKTtcclxuICAgIH0pO1xyXG5cclxuICByZW5kZXJMZWdlbmQgPSAod2lkdGgsIGxlZ2VuZE9mZnNldCkgPT4ge1xyXG4gICAgY29uc3QgeyBsZWdlbmQsIGRhdGFzZXRzIH0gPSB0aGlzLnByb3BzLmRhdGE7XHJcbiAgICBjb25zdCBiYXNlTGVnZW5kSXRlbVggPSB3aWR0aCAvIChsZWdlbmQubGVuZ3RoICsgMSk7XHJcblxyXG4gICAgcmV0dXJuIGxlZ2VuZC5tYXAoKGxlZ2VuZEl0ZW0sIGkpID0+IChcclxuICAgICAgPEcga2V5PXtNYXRoLnJhbmRvbSgpfT5cclxuICAgICAgICA8TGVnZW5kSXRlbVxyXG4gICAgICAgICAgaW5kZXg9e2l9XHJcbiAgICAgICAgICBpY29uQ29sb3I9e3RoaXMuZ2V0Q29sb3IoZGF0YXNldHNbaV0sIDAuOSl9XHJcbiAgICAgICAgICBiYXNlTGVnZW5kSXRlbVg9e2Jhc2VMZWdlbmRJdGVtWH1cclxuICAgICAgICAgIGxlZ2VuZFRleHQ9e2xlZ2VuZEl0ZW19XHJcbiAgICAgICAgICBsYWJlbFByb3BzPXt7IC4uLnRoaXMuZ2V0UHJvcHNGb3JMYWJlbHMoKSB9fVxyXG4gICAgICAgICAgbGVnZW5kT2Zmc2V0PXtsZWdlbmRPZmZzZXR9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9HPlxyXG4gICAgKSk7XHJcbiAgfTtcclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgY29uc3Qge1xyXG4gICAgICB3aWR0aCxcclxuICAgICAgaGVpZ2h0LFxyXG4gICAgICBkYXRhLFxyXG4gICAgICB3aXRoU2Nyb2xsYWJsZURvdCA9IGZhbHNlLFxyXG4gICAgICB3aXRoU2hhZG93ID0gdHJ1ZSxcclxuICAgICAgd2l0aERvdHMgPSB0cnVlLFxyXG4gICAgICB3aXRoSW5uZXJMaW5lcyA9IHRydWUsXHJcbiAgICAgIHdpdGhPdXRlckxpbmVzID0gdHJ1ZSxcclxuICAgICAgd2l0aEhvcml6b250YWxMaW5lcyA9IHRydWUsXHJcbiAgICAgIHdpdGhWZXJ0aWNhbExpbmVzID0gdHJ1ZSxcclxuICAgICAgd2l0aEhvcml6b250YWxMYWJlbHMgPSB0cnVlLFxyXG4gICAgICB3aXRoVmVydGljYWxMYWJlbHMgPSB0cnVlLFxyXG4gICAgICBzdHlsZSA9IHt9LFxyXG4gICAgICBkZWNvcmF0b3IsXHJcbiAgICAgIG9uRGF0YVBvaW50Q2xpY2ssXHJcbiAgICAgIHZlcnRpY2FsTGFiZWxSb3RhdGlvbiA9IDAsXHJcbiAgICAgIGhvcml6b250YWxMYWJlbFJvdGF0aW9uID0gMCxcclxuICAgICAgZm9ybWF0WUxhYmVsID0geUxhYmVsID0+IHlMYWJlbCxcclxuICAgICAgZm9ybWF0WExhYmVsID0geExhYmVsID0+IHhMYWJlbCxcclxuICAgICAgc2VnbWVudHMsXHJcbiAgICAgIHRyYW5zcGFyZW50ID0gZmFsc2UsXHJcbiAgICAgIGNoYXJ0Q29uZmlnXHJcbiAgICB9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICBjb25zdCB7IHNjcm9sbGFibGVEb3RIb3Jpem9udGFsT2Zmc2V0IH0gPSB0aGlzLnN0YXRlO1xyXG4gICAgY29uc3QgeyBsYWJlbHMgPSBbXSB9ID0gZGF0YTtcclxuICAgIGNvbnN0IHtcclxuICAgICAgYm9yZGVyUmFkaXVzID0gMCxcclxuICAgICAgcGFkZGluZ1RvcCA9IDE2LFxyXG4gICAgICBwYWRkaW5nUmlnaHQgPSA2NCxcclxuICAgICAgbWFyZ2luID0gMCxcclxuICAgICAgbWFyZ2luUmlnaHQgPSAwLFxyXG4gICAgICBwYWRkaW5nQm90dG9tID0gMFxyXG4gICAgfSA9IHN0eWxlO1xyXG5cclxuICAgIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgICAgd2lkdGgsXHJcbiAgICAgIGhlaWdodCxcclxuICAgICAgdmVydGljYWxMYWJlbFJvdGF0aW9uLFxyXG4gICAgICBob3Jpem9udGFsTGFiZWxSb3RhdGlvblxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBkYXRhcyA9IHRoaXMuZ2V0RGF0YXMoZGF0YS5kYXRhc2V0cyk7XHJcblxyXG4gICAgbGV0IGNvdW50ID0gTWF0aC5taW4oLi4uZGF0YXMpID09PSBNYXRoLm1heCguLi5kYXRhcykgPyAxIDogNDtcclxuICAgIGlmIChzZWdtZW50cykge1xyXG4gICAgICBjb3VudCA9IHNlZ21lbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxlZ2VuZE9mZnNldCA9IHRoaXMucHJvcHMuZGF0YS5sZWdlbmQgPyBoZWlnaHQgKiAwLjE1IDogMDtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8VmlldyBzdHlsZT17c3R5bGV9PlxyXG4gICAgICAgIDxTdmdcclxuICAgICAgICAgIGhlaWdodD17aGVpZ2h0ICsgKHBhZGRpbmdCb3R0b20gYXMgbnVtYmVyKSArIGxlZ2VuZE9mZnNldH1cclxuICAgICAgICAgIHdpZHRoPXt3aWR0aCAtIChtYXJnaW4gYXMgbnVtYmVyKSAqIDIgLSAobWFyZ2luUmlnaHQgYXMgbnVtYmVyKX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8UmVjdFxyXG4gICAgICAgICAgICB3aWR0aD1cIjEwMCVcIlxyXG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodCArIGxlZ2VuZE9mZnNldH1cclxuICAgICAgICAgICAgcng9e2JvcmRlclJhZGl1c31cclxuICAgICAgICAgICAgcnk9e2JvcmRlclJhZGl1c31cclxuICAgICAgICAgICAgZmlsbD1cInVybCgjYmFja2dyb3VuZEdyYWRpZW50KVwiXHJcbiAgICAgICAgICAgIGZpbGxPcGFjaXR5PXt0cmFuc3BhcmVudCA/IDAgOiAxfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIHt0aGlzLnByb3BzLmRhdGEubGVnZW5kICYmXHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyTGVnZW5kKGNvbmZpZy53aWR0aCwgbGVnZW5kT2Zmc2V0KX1cclxuICAgICAgICAgIDxHIHg9XCIwXCIgeT17bGVnZW5kT2Zmc2V0fT5cclxuICAgICAgICAgICAge3RoaXMucmVuZGVyRGVmcyh7XHJcbiAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgIC4uLmNoYXJ0Q29uZmlnLFxyXG4gICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YXNldHNcclxuICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDxHPlxyXG4gICAgICAgICAgICAgIHt3aXRoSG9yaXpvbnRhbExpbmVzICYmXHJcbiAgICAgICAgICAgICAgICAod2l0aElubmVyTGluZXNcclxuICAgICAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlckhvcml6b250YWxMaW5lcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAuLi5jb25maWcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb3VudDogY291bnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgOiB3aXRoT3V0ZXJMaW5lc1xyXG4gICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVySG9yaXpvbnRhbExpbmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcCxcclxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgIDogbnVsbCl9XHJcbiAgICAgICAgICAgIDwvRz5cclxuICAgICAgICAgICAgPEc+XHJcbiAgICAgICAgICAgICAge3dpdGhIb3Jpem9udGFsTGFiZWxzICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckhvcml6b250YWxMYWJlbHMoe1xyXG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXHJcbiAgICAgICAgICAgICAgICAgIGNvdW50OiBjb3VudCxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YXMsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgIGZvcm1hdFlMYWJlbCxcclxuICAgICAgICAgICAgICAgICAgZGVjaW1hbFBsYWNlczogY2hhcnRDb25maWcuZGVjaW1hbFBsYWNlc1xyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvRz5cclxuICAgICAgICAgICAgPEc+XHJcbiAgICAgICAgICAgICAge3dpdGhWZXJ0aWNhbExpbmVzICYmXHJcbiAgICAgICAgICAgICAgICAod2l0aElubmVyTGluZXNcclxuICAgICAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlclZlcnRpY2FsTGluZXMoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0c1swXS5kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXJcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICA6IHdpdGhPdXRlckxpbmVzXHJcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJWZXJ0aWNhbExpbmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXJcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICA6IG51bGwpfVxyXG4gICAgICAgICAgICA8L0c+XHJcbiAgICAgICAgICAgIDxHPlxyXG4gICAgICAgICAgICAgIHt3aXRoVmVydGljYWxMYWJlbHMgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyVmVydGljYWxMYWJlbHMoe1xyXG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXHJcbiAgICAgICAgICAgICAgICAgIGxhYmVscyxcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgZm9ybWF0WExhYmVsXHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC9HPlxyXG4gICAgICAgICAgICA8Rz5cclxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJMaW5lKHtcclxuICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgIC4uLmNoYXJ0Q29uZmlnLFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzXHJcbiAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvRz5cclxuICAgICAgICAgICAgPEc+XHJcbiAgICAgICAgICAgICAge3dpdGhTaGFkb3cgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyU2hhZG93KHtcclxuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IHBhZGRpbmdSaWdodCBhcyBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IHBhZGRpbmdUb3AgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICB1c2VDb2xvckZyb21EYXRhc2V0OiBjaGFydENvbmZpZy51c2VTaGFkb3dDb2xvckZyb21EYXRhc2V0XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC9HPlxyXG4gICAgICAgICAgICA8Rz5cclxuICAgICAgICAgICAgICB7d2l0aERvdHMgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRG90cyh7XHJcbiAgICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhc2V0cyxcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1RvcDogcGFkZGluZ1RvcCBhcyBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogcGFkZGluZ1JpZ2h0IGFzIG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgb25EYXRhUG9pbnRDbGlja1xyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvRz5cclxuICAgICAgICAgICAgPEc+XHJcbiAgICAgICAgICAgICAge3dpdGhTY3JvbGxhYmxlRG90ICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclNjcm9sbGFibGVEb3Qoe1xyXG4gICAgICAgICAgICAgICAgICAuLi5jb25maWcsXHJcbiAgICAgICAgICAgICAgICAgIC4uLmNoYXJ0Q29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wOiBwYWRkaW5nVG9wIGFzIG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiBwYWRkaW5nUmlnaHQgYXMgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICBvbkRhdGFQb2ludENsaWNrLFxyXG4gICAgICAgICAgICAgICAgICBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldFxyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvRz5cclxuICAgICAgICAgICAgPEc+XHJcbiAgICAgICAgICAgICAge2RlY29yYXRvciAmJlxyXG4gICAgICAgICAgICAgICAgZGVjb3JhdG9yKHtcclxuICAgICAgICAgICAgICAgICAgLi4uY29uZmlnLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGFzZXRzLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nVG9wLFxyXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nUmlnaHRcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L0c+XHJcbiAgICAgICAgICA8L0c+XHJcbiAgICAgICAgPC9Tdmc+XHJcbiAgICAgICAge3dpdGhTY3JvbGxhYmxlRG90ICYmIChcclxuICAgICAgICAgIDxTY3JvbGxWaWV3XHJcbiAgICAgICAgICAgIHN0eWxlPXtTdHlsZVNoZWV0LmFic29sdXRlRmlsbH1cclxuICAgICAgICAgICAgY29udGVudENvbnRhaW5lclN0eWxlPXt7IHdpZHRoOiB3aWR0aCAqIDIgfX1cclxuICAgICAgICAgICAgc2hvd3NIb3Jpem9udGFsU2Nyb2xsSW5kaWNhdG9yPXtmYWxzZX1cclxuICAgICAgICAgICAgc2Nyb2xsRXZlbnRUaHJvdHRsZT17MTZ9XHJcbiAgICAgICAgICAgIG9uU2Nyb2xsPXtBbmltYXRlZC5ldmVudChbXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmF0aXZlRXZlbnQ6IHtcclxuICAgICAgICAgICAgICAgICAgY29udGVudE9mZnNldDogeyB4OiBzY3JvbGxhYmxlRG90SG9yaXpvbnRhbE9mZnNldCB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdKX1cclxuICAgICAgICAgICAgaG9yaXpvbnRhbFxyXG4gICAgICAgICAgICBib3VuY2VzPXtmYWxzZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgKX1cclxuICAgICAgPC9WaWV3PlxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExpbmVDaGFydDtcclxuIl19
