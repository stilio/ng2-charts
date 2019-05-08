/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Directive, Input, Output, EventEmitter, ElementRef, } from '@angular/core';
import * as chartJs from 'chart.js';
import { getColors } from './get-colors';
import { ThemeService } from './theme.service';
import { cloneDeep } from 'lodash';
/**
 * @record
 */
function OldState() { }
if (false) {
    /** @type {?} */
    OldState.prototype.dataExists;
    /** @type {?} */
    OldState.prototype.dataLength;
    /** @type {?} */
    OldState.prototype.datasetsExists;
    /** @type {?} */
    OldState.prototype.datasetsLength;
    /** @type {?} */
    OldState.prototype.datasetsDataObjects;
    /** @type {?} */
    OldState.prototype.datasetsDataLengths;
    /** @type {?} */
    OldState.prototype.colorsExists;
    /** @type {?} */
    OldState.prototype.colors;
    /** @type {?} */
    OldState.prototype.labelsExist;
    /** @type {?} */
    OldState.prototype.labels;
    /** @type {?} */
    OldState.prototype.legendExists;
    /** @type {?} */
    OldState.prototype.legend;
}
/** @enum {number} */
var UpdateType = {
    Default: 0,
    Update: 1,
    Refresh: 2,
};
UpdateType[UpdateType.Default] = 'Default';
UpdateType[UpdateType.Update] = 'Update';
UpdateType[UpdateType.Refresh] = 'Refresh';
var BaseChartDirective = /** @class */ (function () {
    function BaseChartDirective(element, themeService) {
        this.element = element;
        this.themeService = themeService;
        this.options = {};
        this.chartClick = new EventEmitter();
        this.chartHover = new EventEmitter();
        this.old = {
            dataExists: false,
            dataLength: 0,
            datasetsExists: false,
            datasetsLength: 0,
            datasetsDataObjects: [],
            datasetsDataLengths: [],
            colorsExists: false,
            colors: [],
            labelsExist: false,
            labels: [],
            legendExists: false,
            legend: {},
        };
        this.subs = [];
    }
    /**
     * Register a plugin.
     */
    /**
     * Register a plugin.
     * @param {?} plugin
     * @return {?}
     */
    BaseChartDirective.registerPlugin = /**
     * Register a plugin.
     * @param {?} plugin
     * @return {?}
     */
    function (plugin) {
        chartJs.Chart.plugins.register(plugin);
    };
    /**
     * @param {?} plugin
     * @return {?}
     */
    BaseChartDirective.unregisterPlugin = /**
     * @param {?} plugin
     * @return {?}
     */
    function (plugin) {
        chartJs.Chart.plugins.unregister(plugin);
    };
    /**
     * @return {?}
     */
    BaseChartDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.ctx = this.element.nativeElement.getContext('2d');
        this.refresh();
        this.subs.push(this.themeService.colorschemesOptions.subscribe((/**
         * @param {?} r
         * @return {?}
         */
        function (r) { return _this.themeChanged(r); })));
    };
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    BaseChartDirective.prototype.themeChanged = /**
     * @private
     * @param {?} options
     * @return {?}
     */
    function (options) {
        this.refresh();
    };
    /**
     * @return {?}
     */
    BaseChartDirective.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.chart) {
            return;
        }
        /** @type {?} */
        var updateRequired = UpdateType.Default;
        /** @type {?} */
        var wantUpdate = (/**
         * @param {?} x
         * @return {?}
         */
        function (x) {
            updateRequired = x > updateRequired ? x : updateRequired;
        });
        if (!!this.data !== this.old.dataExists) {
            this.propagateDataToDatasets(this.data);
            this.old.dataExists = !!this.data;
            wantUpdate(UpdateType.Update);
        }
        if (this.data && this.data.length !== this.old.dataLength) {
            this.old.dataLength = this.data && this.data.length || 0;
            wantUpdate(UpdateType.Update);
        }
        if (!!this.datasets !== this.old.datasetsExists) {
            this.old.datasetsExists = !!this.datasets;
            wantUpdate(UpdateType.Update);
        }
        if (this.datasets && this.datasets.length !== this.old.datasetsLength) {
            this.old.datasetsLength = this.datasets && this.datasets.length || 0;
            wantUpdate(UpdateType.Update);
        }
        if (this.datasets && this.datasets.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        function (x, i) { return x.data !== _this.old.datasetsDataObjects[i]; })).length) {
            this.old.datasetsDataObjects = this.datasets.map((/**
             * @param {?} x
             * @return {?}
             */
            function (x) { return x.data; }));
            wantUpdate(UpdateType.Update);
        }
        if (this.datasets && this.datasets.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        function (x, i) { return x.data.length !== _this.old.datasetsDataLengths[i]; })).length) {
            this.old.datasetsDataLengths = this.datasets.map((/**
             * @param {?} x
             * @return {?}
             */
            function (x) { return x.data.length; }));
            wantUpdate(UpdateType.Update);
        }
        if (!!this.colors !== this.old.colorsExists) {
            this.old.colorsExists = !!this.colors;
            this.updateColors();
            wantUpdate(UpdateType.Update);
        }
        // This smells of inefficiency, might need to revisit this
        if (this.colors && this.colors.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        function (x, i) { return !_this.colorsEqual(x, _this.old.colors[i]); })).length) {
            this.old.colors = this.colors.map((/**
             * @param {?} x
             * @return {?}
             */
            function (x) { return _this.copyColor(x); }));
            this.updateColors();
            wantUpdate(UpdateType.Update);
        }
        if (!!this.labels !== this.old.labelsExist) {
            this.old.labelsExist = !!this.labels;
            wantUpdate(UpdateType.Update);
        }
        if (this.labels && this.labels.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        function (x, i) { return !_this.labelsEqual(x, _this.old.labels[i]); })).length) {
            this.old.labels = this.labels.map((/**
             * @param {?} x
             * @return {?}
             */
            function (x) { return _this.copyLabel(x); }));
            wantUpdate(UpdateType.Update);
        }
        if (!!this.options.legend !== this.old.legendExists) {
            this.old.legendExists = !!this.options.legend;
            wantUpdate(UpdateType.Refresh);
        }
        if (this.options.legend && this.options.legend.position !== this.old.legend.position) {
            this.old.legend.position = this.options.legend.position;
            wantUpdate(UpdateType.Refresh);
        }
        switch ((/** @type {?} */ (updateRequired))) {
            case UpdateType.Default:
                break;
            case UpdateType.Update:
                this.update();
                break;
            case UpdateType.Refresh:
                this.refresh();
                break;
        }
    };
    /**
     * @param {?} a
     * @return {?}
     */
    BaseChartDirective.prototype.copyLabel = /**
     * @param {?} a
     * @return {?}
     */
    function (a) {
        if (Array.isArray(a)) {
            return tslib_1.__spread(a);
        }
        return a;
    };
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    BaseChartDirective.prototype.labelsEqual = /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function (a, b) {
        return true
            && Array.isArray(a) === Array.isArray(b)
            && (Array.isArray(a) || a === b)
            && (!Array.isArray(a) || a.length === b.length)
            && (!Array.isArray(a) || a.filter((/**
             * @param {?} x
             * @param {?} i
             * @return {?}
             */
            function (x, i) { return x !== b[i]; })).length === 0);
    };
    /**
     * @param {?} a
     * @return {?}
     */
    BaseChartDirective.prototype.copyColor = /**
     * @param {?} a
     * @return {?}
     */
    function (a) {
        /** @type {?} */
        var rc = {
            backgroundColor: a.backgroundColor,
            borderWidth: a.borderWidth,
            borderColor: a.borderColor,
            borderCapStyle: a.borderCapStyle,
            borderDash: a.borderDash,
            borderDashOffset: a.borderDashOffset,
            borderJoinStyle: a.borderJoinStyle,
            pointBorderColor: a.pointBorderColor,
            pointBackgroundColor: a.pointBackgroundColor,
            pointBorderWidth: a.pointBorderWidth,
            pointRadius: a.pointRadius,
            pointHoverRadius: a.pointHoverRadius,
            pointHitRadius: a.pointHitRadius,
            pointHoverBackgroundColor: a.pointHoverBackgroundColor,
            pointHoverBorderColor: a.pointHoverBorderColor,
            pointHoverBorderWidth: a.pointHoverBorderWidth,
            pointStyle: a.pointStyle,
            hoverBackgroundColor: a.hoverBackgroundColor,
            hoverBorderColor: a.hoverBorderColor,
            hoverBorderWidth: a.hoverBorderWidth,
        };
        return rc;
    };
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    BaseChartDirective.prototype.colorsEqual = /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    function (a, b) {
        if (!a !== !b) {
            return false;
        }
        return !a || true
            && (a.backgroundColor === b.backgroundColor)
            && (a.borderWidth === b.borderWidth)
            && (a.borderColor === b.borderColor)
            && (a.borderCapStyle === b.borderCapStyle)
            && (a.borderDash === b.borderDash)
            && (a.borderDashOffset === b.borderDashOffset)
            && (a.borderJoinStyle === b.borderJoinStyle)
            && (a.pointBorderColor === b.pointBorderColor)
            && (a.pointBackgroundColor === b.pointBackgroundColor)
            && (a.pointBorderWidth === b.pointBorderWidth)
            && (a.pointRadius === b.pointRadius)
            && (a.pointHoverRadius === b.pointHoverRadius)
            && (a.pointHitRadius === b.pointHitRadius)
            && (a.pointHoverBackgroundColor === b.pointHoverBackgroundColor)
            && (a.pointHoverBorderColor === b.pointHoverBorderColor)
            && (a.pointHoverBorderWidth === b.pointHoverBorderWidth)
            && (a.pointStyle === b.pointStyle)
            && (a.hoverBackgroundColor === b.hoverBackgroundColor)
            && (a.hoverBorderColor === b.hoverBorderColor)
            && (a.hoverBorderWidth === b.hoverBorderWidth);
    };
    /**
     * @return {?}
     */
    BaseChartDirective.prototype.updateColors = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.datasets.forEach((/**
         * @param {?} elm
         * @param {?} index
         * @return {?}
         */
        function (elm, index) {
            if (_this.colors && _this.colors[index]) {
                Object.assign(elm, _this.colors[index]);
            }
            else {
                Object.assign(elm, getColors(_this.chartType, index, elm.data.length), tslib_1.__assign({}, elm));
            }
        }));
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    BaseChartDirective.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        /** @type {?} */
        var updateRequired = UpdateType.Default;
        /** @type {?} */
        var wantUpdate = (/**
         * @param {?} x
         * @return {?}
         */
        function (x) {
            updateRequired = x > updateRequired ? x : updateRequired;
        });
        // Check if the changes are in the data or datasets or labels or legend
        if (changes.hasOwnProperty('data') && changes.data.currentValue) {
            this.propagateDataToDatasets(changes.data.currentValue);
            wantUpdate(UpdateType.Update);
        }
        if (changes.hasOwnProperty('datasets') && changes.datasets.currentValue) {
            this.propagateDatasetsToData(changes.datasets.currentValue);
            wantUpdate(UpdateType.Update);
        }
        if (changes.hasOwnProperty('labels')) {
            if (this.chart) {
                this.chart.data.labels = changes.labels.currentValue;
            }
            wantUpdate(UpdateType.Update);
        }
        if (changes.hasOwnProperty('legend')) {
            if (this.chart) {
                this.chart.config.options.legend.display = changes.legend.currentValue;
                this.chart.generateLegend();
            }
            wantUpdate(UpdateType.Update);
        }
        if (changes.hasOwnProperty('options')) {
            wantUpdate(UpdateType.Refresh);
        }
        switch ((/** @type {?} */ (updateRequired))) {
            case UpdateType.Update:
                this.update();
                break;
            case UpdateType.Refresh:
            case UpdateType.Default:
                this.refresh();
                break;
        }
    };
    /**
     * @return {?}
     */
    BaseChartDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.chart) {
            this.chart.destroy();
            this.chart = void 0;
        }
        this.subs.forEach((/**
         * @param {?} x
         * @return {?}
         */
        function (x) { return x.unsubscribe(); }));
    };
    /**
     * @param {?=} duration
     * @param {?=} lazy
     * @return {?}
     */
    BaseChartDirective.prototype.update = /**
     * @param {?=} duration
     * @param {?=} lazy
     * @return {?}
     */
    function (duration, lazy) {
        if (this.chart) {
            return this.chart.update(duration, lazy);
        }
    };
    /**
     * @param {?} index
     * @param {?} hidden
     * @return {?}
     */
    BaseChartDirective.prototype.hideDataset = /**
     * @param {?} index
     * @param {?} hidden
     * @return {?}
     */
    function (index, hidden) {
        this.chart.getDatasetMeta(index).hidden = hidden;
        this.chart.update();
    };
    /**
     * @param {?} index
     * @return {?}
     */
    BaseChartDirective.prototype.isDatasetHidden = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        return this.chart.getDatasetMeta(index).hidden;
    };
    /**
     * @return {?}
     */
    BaseChartDirective.prototype.toBase64Image = /**
     * @return {?}
     */
    function () {
        return this.chart.toBase64Image();
    };
    /**
     * @return {?}
     */
    BaseChartDirective.prototype.getChartConfiguration = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var datasets = this.getDatasets();
        /** @type {?} */
        var options = Object.assign({}, this.options);
        if (this.legend === false) {
            options.legend = { display: false };
        }
        // hook for onHover and onClick events
        options.hover = options.hover || {};
        if (!options.hover.onHover) {
            options.hover.onHover = (/**
             * @param {?} event
             * @param {?} active
             * @return {?}
             */
            function (event, active) {
                if (active && !active.length) {
                    return;
                }
                _this.chartHover.emit({ event: event, active: active });
            });
        }
        if (!options.onClick) {
            options.onClick = (/**
             * @param {?=} event
             * @param {?=} active
             * @return {?}
             */
            function (event, active) {
                _this.chartClick.emit({ event: event, active: active });
            });
        }
        /** @type {?} */
        var mergedOptions = this.smartMerge(options, this.themeService.getColorschemesOptions());
        /** @type {?} */
        var chartConfig = {
            type: this.chartType,
            data: {
                labels: this.labels || [],
                datasets: datasets
            },
            plugins: this.plugins,
            options: mergedOptions,
        };
        return chartConfig;
    };
    /**
     * @param {?} ctx
     * @return {?}
     */
    BaseChartDirective.prototype.getChartBuilder = /**
     * @param {?} ctx
     * @return {?}
     */
    function (ctx /*, data:any[], options:any*/) {
        /** @type {?} */
        var chartConfig = this.getChartConfiguration();
        return new chartJs.Chart(ctx, chartConfig);
    };
    /**
     * @param {?} options
     * @param {?} overrides
     * @param {?=} level
     * @return {?}
     */
    BaseChartDirective.prototype.smartMerge = /**
     * @param {?} options
     * @param {?} overrides
     * @param {?=} level
     * @return {?}
     */
    function (options, overrides, level) {
        var _this = this;
        if (level === void 0) { level = 0; }
        if (level === 0) {
            options = cloneDeep(options);
        }
        /** @type {?} */
        var keysToUpdate = Object.keys(overrides);
        keysToUpdate.forEach((/**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            if (Array.isArray(overrides[key])) {
                /** @type {?} */
                var arrayElements = options[key];
                if (arrayElements) {
                    arrayElements.forEach((/**
                     * @param {?} r
                     * @return {?}
                     */
                    function (r) {
                        _this.smartMerge(r, overrides[key][0], level + 1);
                    }));
                }
            }
            else if (typeof (overrides[key]) === 'object') {
                if (!(key in options)) {
                    options[key] = {};
                }
                _this.smartMerge(options[key], overrides[key], level + 1);
            }
            else {
                options[key] = overrides[key];
            }
        }));
        if (level === 0) {
            return options;
        }
    };
    /**
     * @private
     * @param {?} label
     * @return {?}
     */
    BaseChartDirective.prototype.isMultiLineLabel = /**
     * @private
     * @param {?} label
     * @return {?}
     */
    function (label) {
        return Array.isArray(label);
    };
    /**
     * @private
     * @param {?} label
     * @return {?}
     */
    BaseChartDirective.prototype.joinLabel = /**
     * @private
     * @param {?} label
     * @return {?}
     */
    function (label) {
        if (!label) {
            return null;
        }
        if (this.isMultiLineLabel(label)) {
            return label.join(' ');
        }
        else {
            return label;
        }
    };
    /**
     * @private
     * @param {?} datasets
     * @return {?}
     */
    BaseChartDirective.prototype.propagateDatasetsToData = /**
     * @private
     * @param {?} datasets
     * @return {?}
     */
    function (datasets) {
        this.data = this.datasets.map((/**
         * @param {?} r
         * @return {?}
         */
        function (r) { return r.data; }));
        if (this.chart) {
            this.chart.data.datasets = datasets;
        }
        this.updateColors();
    };
    /**
     * @private
     * @param {?} newDataValues
     * @return {?}
     */
    BaseChartDirective.prototype.propagateDataToDatasets = /**
     * @private
     * @param {?} newDataValues
     * @return {?}
     */
    function (newDataValues) {
        var _this = this;
        if (this.isMultiDataSet(newDataValues)) {
            if (this.datasets && newDataValues.length === this.datasets.length) {
                this.datasets.forEach((/**
                 * @param {?} dataset
                 * @param {?} i
                 * @return {?}
                 */
                function (dataset, i) {
                    dataset.data = newDataValues[i];
                }));
            }
            else {
                this.datasets = newDataValues.map((/**
                 * @param {?} data
                 * @param {?} index
                 * @return {?}
                 */
                function (data, index) {
                    return { data: data, label: _this.joinLabel(_this.labels[index]) || "Label " + index };
                }));
                if (this.chart) {
                    this.chart.data.datasets = this.datasets;
                }
            }
        }
        else {
            if (!this.datasets) {
                this.datasets = [{ data: newDataValues }];
                if (this.chart) {
                    this.chart.data.datasets = this.datasets;
                }
            }
            else {
                this.datasets[0].data = newDataValues;
                this.datasets.splice(1); // Remove all elements but the first
            }
        }
        this.updateColors();
    };
    /**
     * @private
     * @param {?} data
     * @return {?}
     */
    BaseChartDirective.prototype.isMultiDataSet = /**
     * @private
     * @param {?} data
     * @return {?}
     */
    function (data) {
        return Array.isArray(data[0]);
    };
    /**
     * @private
     * @return {?}
     */
    BaseChartDirective.prototype.getDatasets = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this.datasets && !this.data) {
            throw new Error("ng-charts configuration error, data or datasets field are required to render chart " + this.chartType);
        }
        // If `datasets` is defined, use it over the `data` property.
        if (this.datasets) {
            this.propagateDatasetsToData(this.datasets);
            return this.datasets;
        }
        if (this.data) {
            this.propagateDataToDatasets(this.data);
            return this.datasets;
        }
    };
    /**
     * @private
     * @return {?}
     */
    BaseChartDirective.prototype.refresh = /**
     * @private
     * @return {?}
     */
    function () {
        // if (this.options && this.options.responsive) {
        //   setTimeout(() => this.refresh(), 50);
        // }
        // todo: remove this line, it is producing flickering
        if (this.chart) {
            this.chart.destroy();
            this.chart = void 0;
        }
        if (this.ctx) {
            this.chart = this.getChartBuilder(this.ctx /*, data, this.options*/);
        }
    };
    BaseChartDirective.decorators = [
        { type: Directive, args: [{
                    // tslint:disable-next-line:directive-selector
                    selector: 'canvas[baseChart]',
                    exportAs: 'base-chart'
                },] }
    ];
    /** @nocollapse */
    BaseChartDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ThemeService }
    ]; };
    BaseChartDirective.propDecorators = {
        data: [{ type: Input }],
        datasets: [{ type: Input }],
        labels: [{ type: Input }],
        options: [{ type: Input }],
        chartType: [{ type: Input }],
        colors: [{ type: Input }],
        legend: [{ type: Input }],
        plugins: [{ type: Input }],
        chartClick: [{ type: Output }],
        chartHover: [{ type: Output }]
    };
    return BaseChartDirective;
}());
export { BaseChartDirective };
if (false) {
    /** @type {?} */
    BaseChartDirective.prototype.data;
    /** @type {?} */
    BaseChartDirective.prototype.datasets;
    /** @type {?} */
    BaseChartDirective.prototype.labels;
    /** @type {?} */
    BaseChartDirective.prototype.options;
    /** @type {?} */
    BaseChartDirective.prototype.chartType;
    /** @type {?} */
    BaseChartDirective.prototype.colors;
    /** @type {?} */
    BaseChartDirective.prototype.legend;
    /** @type {?} */
    BaseChartDirective.prototype.plugins;
    /** @type {?} */
    BaseChartDirective.prototype.chartClick;
    /** @type {?} */
    BaseChartDirective.prototype.chartHover;
    /** @type {?} */
    BaseChartDirective.prototype.ctx;
    /** @type {?} */
    BaseChartDirective.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    BaseChartDirective.prototype.old;
    /**
     * @type {?}
     * @private
     */
    BaseChartDirective.prototype.subs;
    /**
     * @type {?}
     * @private
     */
    BaseChartDirective.prototype.element;
    /**
     * @type {?}
     * @private
     */
    BaseChartDirective.prototype.themeService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1jaGFydC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZzItY2hhcnRzLyIsInNvdXJjZXMiOlsibGliL2Jhc2UtY2hhcnQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFJVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEdBR1gsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxLQUFLLE9BQU8sTUFBTSxVQUFVLENBQUM7QUFDcEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUV6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFFBQVEsQ0FBQzs7OztBQVduQyx1QkFlQzs7O0lBZEMsOEJBQW9COztJQUNwQiw4QkFBbUI7O0lBQ25CLGtDQUF3Qjs7SUFDeEIsa0NBQXVCOztJQUN2Qix1Q0FBMkI7O0lBQzNCLHVDQUE4Qjs7SUFDOUIsZ0NBQXNCOztJQUN0QiwwQkFBZ0I7O0lBQ2hCLCtCQUFxQjs7SUFDckIsMEJBQWdCOztJQUNoQixnQ0FBc0I7O0lBQ3RCLDBCQUVFOzs7O0lBSUYsVUFBTztJQUNQLFNBQU07SUFDTixVQUFPOzs7OztBQUdUO0lBaURFLDRCQUNVLE9BQW1CLEVBQ25CLFlBQTBCO1FBRDFCLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFDbkIsaUJBQVksR0FBWixZQUFZLENBQWM7UUExQ3BCLFlBQU8sR0FBeUIsRUFBRSxDQUFDO1FBTWxDLGVBQVUsR0FBd0QsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNyRixlQUFVLEdBQXNELElBQUksWUFBWSxFQUFFLENBQUM7UUFLNUYsUUFBRyxHQUFhO1lBQ3RCLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLFVBQVUsRUFBRSxDQUFDO1lBQ2IsY0FBYyxFQUFFLEtBQUs7WUFDckIsY0FBYyxFQUFFLENBQUM7WUFD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QUVELElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUU7WUFDM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFFdEMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRXBCLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0I7UUFFRCwwREFBMEQ7UUFDMUQsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTs7Ozs7UUFBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLEtBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQXhDLENBQXdDLEVBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDaEcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHOzs7O1lBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFqQixDQUFpQixFQUFDLENBQUM7WUFFMUQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRXBCLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0I7UUFFRCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFO1lBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBRXJDLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0I7UUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNOzs7OztRQUFDLFVB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QyxDQUFDO1NBQ3JFO0lBQ0gsQ0FBQzs7Z0JBaGVGLFNBQVMsU0FBQzs7b0JBRVQsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsUUFBUSxFQUFFLFlBQVk7aUJBQ3ZCOzs7O2dCQS9DQyxVQUFVO2dCQU9ILFlBQVk7Ozt1QkEwQ2xCLEtBQUs7MkJBQ0wsS0FBSzt5QkFDTCxLQUFLOzBCQUNMLEtBQUs7NEJBQ0wsS0FBSzt5QkFDTCxLQUFLO3lCQUNMLEtBQUs7MEJBQ0wsS0FBSzs2QkFFTCxNQUFNOzZCQUNOLE1BQU07O0lBaWRULHlCQUFDO0NBQUEsQUFqZUQsSUFpZUM7U0E1ZFksa0JBQWtCOzs7SUFDN0Isa0NBQTJDOztJQUMzQyxzQ0FBa0Q7O0lBQ2xELG9DQUFnQzs7SUFDaEMscUNBQW1EOztJQUNuRCx1Q0FBNkM7O0lBQzdDLG9DQUFnQzs7SUFDaEMsb0NBQWdDOztJQUNoQyxxQ0FBcUU7O0lBRXJFLHdDQUFzRzs7SUFDdEcsd0NBQW9HOztJQUVwRyxpQ0FBbUI7O0lBQ25CLG1DQUFvQjs7Ozs7SUFFcEIsaUNBYUU7Ozs7O0lBRUYsa0NBQWtDOzs7OztJQWNoQyxxQ0FBMkI7Ozs7O0lBQzNCLDBDQUFrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgT25EZXN0cm95LFxuICBPbkNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBFbGVtZW50UmVmLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBEb0NoZWNrLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCAqIGFzIGNoYXJ0SnMgZnJvbSAnY2hhcnQuanMnO1xuaW1wb3J0IHsgZ2V0Q29sb3JzIH0gZnJvbSAnLi9nZXQtY29sb3JzJztcbmltcG9ydCB7IENvbG9yIH0gZnJvbSAnLi9jb2xvcic7XG5pbXBvcnQgeyBUaGVtZVNlcnZpY2UgfSBmcm9tICcuL3RoZW1lLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjbG9uZURlZXAgfSBmcm9tICdsb2Rhc2gnO1xuXG5leHBvcnQgdHlwZSBTaW5nbGVEYXRhU2V0ID0gKG51bWJlcltdIHwgY2hhcnRKcy5DaGFydFBvaW50W10pO1xuZXhwb3J0IHR5cGUgTXVsdGlEYXRhU2V0ID0gKG51bWJlcltdIHwgY2hhcnRKcy5DaGFydFBvaW50W10pW107XG5leHBvcnQgdHlwZSBTaW5nbGVPck11bHRpRGF0YVNldCA9IFNpbmdsZURhdGFTZXQgfCBNdWx0aURhdGFTZXQ7XG5cbmV4cG9ydCB0eXBlIFBsdWdpblNlcnZpY2VHbG9iYWxSZWdpc3RyYXRpb25BbmRPcHRpb25zID0gY2hhcnRKcy5QbHVnaW5TZXJ2aWNlR2xvYmFsUmVnaXN0cmF0aW9uICYgY2hhcnRKcy5QbHVnaW5TZXJ2aWNlUmVnaXN0cmF0aW9uT3B0aW9ucztcbmV4cG9ydCB0eXBlIFNpbmdsZUxpbmVMYWJlbCA9IHN0cmluZztcbmV4cG9ydCB0eXBlIE11bHRpTGluZUxhYmVsID0gc3RyaW5nW107XG5leHBvcnQgdHlwZSBMYWJlbCA9IFNpbmdsZUxpbmVMYWJlbCB8IE11bHRpTGluZUxhYmVsO1xuXG5pbnRlcmZhY2UgT2xkU3RhdGUge1xuICBkYXRhRXhpc3RzOiBib29sZWFuO1xuICBkYXRhTGVuZ3RoOiBudW1iZXI7XG4gIGRhdGFzZXRzRXhpc3RzOiBib29sZWFuO1xuICBkYXRhc2V0c0xlbmd0aDogbnVtYmVyO1xuICBkYXRhc2V0c0RhdGFPYmplY3RzOiBhbnlbXTtcbiAgZGF0YXNldHNEYXRhTGVuZ3RoczogbnVtYmVyW107XG4gIGNvbG9yc0V4aXN0czogYm9vbGVhbjtcbiAgY29sb3JzOiBDb2xvcltdO1xuICBsYWJlbHNFeGlzdDogYm9vbGVhbjtcbiAgbGFiZWxzOiBMYWJlbFtdO1xuICBsZWdlbmRFeGlzdHM6IGJvb2xlYW47XG4gIGxlZ2VuZDoge1xuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xuICB9O1xufVxuXG5lbnVtIFVwZGF0ZVR5cGUge1xuICBEZWZhdWx0LFxuICBVcGRhdGUsXG4gIFJlZnJlc2hcbn1cblxuQERpcmVjdGl2ZSh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkaXJlY3RpdmUtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdjYW52YXNbYmFzZUNoYXJ0XScsXG4gIGV4cG9ydEFzOiAnYmFzZS1jaGFydCdcbn0pXG5leHBvcnQgY2xhc3MgQmFzZUNoYXJ0RGlyZWN0aXZlIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkNoYW5nZXMsIE9uSW5pdCwgT25EZXN0cm95LCBEb0NoZWNrIHtcbiAgQElucHV0KCkgcHVibGljIGRhdGE6IFNpbmdsZU9yTXVsdGlEYXRhU2V0O1xuICBASW5wdXQoKSBwdWJsaWMgZGF0YXNldHM6IGNoYXJ0SnMuQ2hhcnREYXRhU2V0c1tdO1xuICBASW5wdXQoKSBwdWJsaWMgbGFiZWxzOiBMYWJlbFtdO1xuICBASW5wdXQoKSBwdWJsaWMgb3B0aW9uczogY2hhcnRKcy5DaGFydE9wdGlvbnMgPSB7fTtcbiAgQElucHV0KCkgcHVibGljIGNoYXJ0VHlwZTogY2hhcnRKcy5DaGFydFR5cGU7XG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvcnM6IENvbG9yW107XG4gIEBJbnB1dCgpIHB1YmxpYyBsZWdlbmQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHB1YmxpYyBwbHVnaW5zOiBQbHVnaW5TZXJ2aWNlR2xvYmFsUmVnaXN0cmF0aW9uQW5kT3B0aW9uc1tdO1xuXG4gIEBPdXRwdXQoKSBwdWJsaWMgY2hhcnRDbGljazogRXZlbnRFbWl0dGVyPHsgZXZlbnQ/OiBNb3VzZUV2ZW50LCBhY3RpdmU/OiB7fVtdIH0+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHVibGljIGNoYXJ0SG92ZXI6IEV2ZW50RW1pdHRlcjx7IGV2ZW50OiBNb3VzZUV2ZW50LCBhY3RpdmU6IHt9W10gfT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHVibGljIGN0eDogc3RyaW5nO1xuICBwdWJsaWMgY2hhcnQ6IENoYXJ0O1xuXG4gIHByaXZhdGUgb2xkOiBPbGRTdGF0ZSA9IHtcbiAgICBkYXRhRXhpc3RzOiBmYWxzZSxcbiAgICBkYXRhTGVuZ3RoOiAwLFxuICAgIGRhdGFzZXRzRXhpc3RzOiBmYWxzZSxcbiAgICBkYXRhc2V0c0xlbmd0aDogMCxcbiAgICBkYXRhc2V0c0RhdGFPYmplY3RzOiBbXSxcbiAgICBkYXRhc2V0c0RhdGFMZW5ndGhzOiBbXSxcbiAgICBjb2xvcnNFeGlzdHM6IGZhbHNlLFxuICAgIGNvbG9yczogW10sXG4gICAgbGFiZWxzRXhpc3Q6IGZhbHNlLFxuICAgIGxhYmVsczogW10sXG4gICAgbGVnZW5kRXhpc3RzOiBmYWxzZSxcbiAgICBsZWdlbmQ6IHt9LFxuICB9O1xuXG4gIHByaXZhdGUgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBwbHVnaW4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyUGx1Z2luKHBsdWdpbjogUGx1Z2luU2VydmljZUdsb2JhbFJlZ2lzdHJhdGlvbkFuZE9wdGlvbnMpIHtcbiAgICBjaGFydEpzLkNoYXJ0LnBsdWdpbnMucmVnaXN0ZXIocGx1Z2luKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgdW5yZWdpc3RlclBsdWdpbihwbHVnaW46IFBsdWdpblNlcnZpY2VHbG9iYWxSZWdpc3RyYXRpb25BbmRPcHRpb25zKSB7XG4gICAgY2hhcnRKcy5DaGFydC5wbHVnaW5zLnVucmVnaXN0ZXIocGx1Z2luKTtcbiAgfVxuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSB0aGVtZVNlcnZpY2U6IFRoZW1lU2VydmljZSxcbiAgKSB7IH1cblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5jdHggPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIHRoaXMuc3Vicy5wdXNoKHRoaXMudGhlbWVTZXJ2aWNlLmNvbG9yc2NoZW1lc09wdGlvbnMuc3Vic2NyaWJlKHIgPT4gdGhpcy50aGVtZUNoYW5nZWQocikpKTtcbiAgfVxuXG4gIHByaXZhdGUgdGhlbWVDaGFuZ2VkKG9wdGlvbnM6IHt9KSB7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNoYXJ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCB1cGRhdGVSZXF1aXJlZCA9IFVwZGF0ZVR5cGUuRGVmYXVsdDtcbiAgICBjb25zdCB3YW50VXBkYXRlID0gKHg6IFVwZGF0ZVR5cGUpID0+IHtcbiAgICAgIHVwZGF0ZVJlcXVpcmVkID0geCA+IHVwZGF0ZVJlcXVpcmVkID8geCA6IHVwZGF0ZVJlcXVpcmVkO1xuICAgIH07XG5cbiAgICBpZiAoISF0aGlzLmRhdGEgIT09IHRoaXMub2xkLmRhdGFFeGlzdHMpIHtcbiAgICAgIHRoaXMucHJvcGFnYXRlRGF0YVRvRGF0YXNldHModGhpcy5kYXRhKTtcblxuICAgICAgdGhpcy5vbGQuZGF0YUV4aXN0cyA9ICEhdGhpcy5kYXRhO1xuXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kYXRhICYmIHRoaXMuZGF0YS5sZW5ndGggIT09IHRoaXMub2xkLmRhdGFMZW5ndGgpIHtcbiAgICAgIHRoaXMub2xkLmRhdGFMZW5ndGggPSB0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLmxlbmd0aCB8fCAwO1xuXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoISF0aGlzLmRhdGFzZXRzICE9PSB0aGlzLm9sZC5kYXRhc2V0c0V4aXN0cykge1xuICAgICAgdGhpcy5vbGQuZGF0YXNldHNFeGlzdHMgPSAhIXRoaXMuZGF0YXNldHM7XG5cbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRhdGFzZXRzICYmIHRoaXMuZGF0YXNldHMubGVuZ3RoICE9PSB0aGlzLm9sZC5kYXRhc2V0c0xlbmd0aCkge1xuICAgICAgdGhpcy5vbGQuZGF0YXNldHNMZW5ndGggPSB0aGlzLmRhdGFzZXRzICYmIHRoaXMuZGF0YXNldHMubGVuZ3RoIHx8IDA7XG5cbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRhdGFzZXRzICYmIHRoaXMuZGF0YXNldHMuZmlsdGVyKCh4LCBpKSA9PiB4LmRhdGEgIT09IHRoaXMub2xkLmRhdGFzZXRzRGF0YU9iamVjdHNbaV0pLmxlbmd0aCkge1xuICAgICAgdGhpcy5vbGQuZGF0YXNldHNEYXRhT2JqZWN0cyA9IHRoaXMuZGF0YXNldHMubWFwKHggPT4geC5kYXRhKTtcblxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGF0YXNldHMgJiYgdGhpcy5kYXRhc2V0cy5maWx0ZXIoKHgsIGkpID0+IHguZGF0YS5sZW5ndGggIT09IHRoaXMub2xkLmRhdGFzZXRzRGF0YUxlbmd0aHNbaV0pLmxlbmd0aCkge1xuICAgICAgdGhpcy5vbGQuZGF0YXNldHNEYXRhTGVuZ3RocyA9IHRoaXMuZGF0YXNldHMubWFwKHggPT4geC5kYXRhLmxlbmd0aCk7XG5cbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xuICAgIH1cblxuICAgIGlmICghIXRoaXMuY29sb3JzICE9PSB0aGlzLm9sZC5jb2xvcnNFeGlzdHMpIHtcbiAgICAgIHRoaXMub2xkLmNvbG9yc0V4aXN0cyA9ICEhdGhpcy5jb2xvcnM7XG5cbiAgICAgIHRoaXMudXBkYXRlQ29sb3JzKCk7XG5cbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgc21lbGxzIG9mIGluZWZmaWNpZW5jeSwgbWlnaHQgbmVlZCB0byByZXZpc2l0IHRoaXNcbiAgICBpZiAodGhpcy5jb2xvcnMgJiYgdGhpcy5jb2xvcnMuZmlsdGVyKCh4LCBpKSA9PiAhdGhpcy5jb2xvcnNFcXVhbCh4LCB0aGlzLm9sZC5jb2xvcnNbaV0pKS5sZW5ndGgpIHtcbiAgICAgIHRoaXMub2xkLmNvbG9ycyA9IHRoaXMuY29sb3JzLm1hcCh4ID0+IHRoaXMuY29weUNvbG9yKHgpKTtcblxuICAgICAgdGhpcy51cGRhdGVDb2xvcnMoKTtcblxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKCEhdGhpcy5sYWJlbHMgIT09IHRoaXMub2xkLmxhYmVsc0V4aXN0KSB7XG4gICAgICB0aGlzLm9sZC5sYWJlbHNFeGlzdCA9ICEhdGhpcy5sYWJlbHM7XG5cbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxhYmVscyAmJiB0aGlzLmxhYmVscy5maWx0ZXIoKHgsIGkpID0+ICF0aGlzLmxhYmVsc0VxdWFsKHgsIHRoaXMub2xkLmxhYmVsc1tpXSkpLmxlbmd0aCkge1xuICAgICAgdGhpcy5vbGQubGFiZWxzID0gdGhpcy5sYWJlbHMubWFwKHggPT4gdGhpcy5jb3B5TGFiZWwoeCkpO1xuXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoISF0aGlzLm9wdGlvbnMubGVnZW5kICE9PSB0aGlzLm9sZC5sZWdlbmRFeGlzdHMpIHtcbiAgICAgIHRoaXMub2xkLmxlZ2VuZEV4aXN0cyA9ICEhdGhpcy5vcHRpb25zLmxlZ2VuZDtcblxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlJlZnJlc2gpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMubGVnZW5kICYmIHRoaXMub3B0aW9ucy5sZWdlbmQucG9zaXRpb24gIT09IHRoaXMub2xkLmxlZ2VuZC5wb3NpdGlvbikge1xuICAgICAgdGhpcy5vbGQubGVnZW5kLnBvc2l0aW9uID0gdGhpcy5vcHRpb25zLmxlZ2VuZC5wb3NpdGlvbjtcblxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlJlZnJlc2gpO1xuICAgIH1cblxuICAgIHN3aXRjaCAodXBkYXRlUmVxdWlyZWQgYXMgVXBkYXRlVHlwZSkge1xuICAgICAgY2FzZSBVcGRhdGVUeXBlLkRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBVcGRhdGVUeXBlLlVwZGF0ZTpcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFVwZGF0ZVR5cGUuUmVmcmVzaDpcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGNvcHlMYWJlbChhOiBMYWJlbCk6IExhYmVsIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhKSkge1xuICAgICAgcmV0dXJuIFsuLi5hXTtcbiAgICB9XG4gICAgcmV0dXJuIGE7XG4gIH1cblxuICBsYWJlbHNFcXVhbChhOiBMYWJlbCwgYjogTGFiZWwpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICAgICAgJiYgQXJyYXkuaXNBcnJheShhKSA9PT0gQXJyYXkuaXNBcnJheShiKVxuICAgICAgJiYgKEFycmF5LmlzQXJyYXkoYSkgfHwgYSA9PT0gYilcbiAgICAgICYmICghQXJyYXkuaXNBcnJheShhKSB8fCBhLmxlbmd0aCA9PT0gYi5sZW5ndGgpXG4gICAgICAmJiAoIUFycmF5LmlzQXJyYXkoYSkgfHwgYS5maWx0ZXIoKHgsIGkpID0+IHggIT09IGJbaV0pLmxlbmd0aCA9PT0gMClcbiAgICAgIDtcbiAgfVxuXG4gIGNvcHlDb2xvcihhOiBDb2xvcik6IENvbG9yIHtcbiAgICBjb25zdCByYzogQ29sb3IgPSB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IGEuYmFja2dyb3VuZENvbG9yLFxuICAgICAgYm9yZGVyV2lkdGg6IGEuYm9yZGVyV2lkdGgsXG4gICAgICBib3JkZXJDb2xvcjogYS5ib3JkZXJDb2xvcixcbiAgICAgIGJvcmRlckNhcFN0eWxlOiBhLmJvcmRlckNhcFN0eWxlLFxuICAgICAgYm9yZGVyRGFzaDogYS5ib3JkZXJEYXNoLFxuICAgICAgYm9yZGVyRGFzaE9mZnNldDogYS5ib3JkZXJEYXNoT2Zmc2V0LFxuICAgICAgYm9yZGVySm9pblN0eWxlOiBhLmJvcmRlckpvaW5TdHlsZSxcbiAgICAgIHBvaW50Qm9yZGVyQ29sb3I6IGEucG9pbnRCb3JkZXJDb2xvcixcbiAgICAgIHBvaW50QmFja2dyb3VuZENvbG9yOiBhLnBvaW50QmFja2dyb3VuZENvbG9yLFxuICAgICAgcG9pbnRCb3JkZXJXaWR0aDogYS5wb2ludEJvcmRlcldpZHRoLFxuICAgICAgcG9pbnRSYWRpdXM6IGEucG9pbnRSYWRpdXMsXG4gICAgICBwb2ludEhvdmVyUmFkaXVzOiBhLnBvaW50SG92ZXJSYWRpdXMsXG4gICAgICBwb2ludEhpdFJhZGl1czogYS5wb2ludEhpdFJhZGl1cyxcbiAgICAgIHBvaW50SG92ZXJCYWNrZ3JvdW5kQ29sb3I6IGEucG9pbnRIb3ZlckJhY2tncm91bmRDb2xvcixcbiAgICAgIHBvaW50SG92ZXJCb3JkZXJDb2xvcjogYS5wb2ludEhvdmVyQm9yZGVyQ29sb3IsXG4gICAgICBwb2ludEhvdmVyQm9yZGVyV2lkdGg6IGEucG9pbnRIb3ZlckJvcmRlcldpZHRoLFxuICAgICAgcG9pbnRTdHlsZTogYS5wb2ludFN0eWxlLFxuICAgICAgaG92ZXJCYWNrZ3JvdW5kQ29sb3I6IGEuaG92ZXJCYWNrZ3JvdW5kQ29sb3IsXG4gICAgICBob3ZlckJvcmRlckNvbG9yOiBhLmhvdmVyQm9yZGVyQ29sb3IsXG4gICAgICBob3ZlckJvcmRlcldpZHRoOiBhLmhvdmVyQm9yZGVyV2lkdGgsXG4gICAgfTtcblxuICAgIHJldHVybiByYztcbiAgfVxuXG4gIGNvbG9yc0VxdWFsKGE6IENvbG9yLCBiOiBDb2xvcikge1xuICAgIGlmICghYSAhPT0gIWIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICFhIHx8IHRydWVcbiAgICAgICYmIChhLmJhY2tncm91bmRDb2xvciA9PT0gYi5iYWNrZ3JvdW5kQ29sb3IpXG4gICAgICAmJiAoYS5ib3JkZXJXaWR0aCA9PT0gYi5ib3JkZXJXaWR0aClcbiAgICAgICYmIChhLmJvcmRlckNvbG9yID09PSBiLmJvcmRlckNvbG9yKVxuICAgICAgJiYgKGEuYm9yZGVyQ2FwU3R5bGUgPT09IGIuYm9yZGVyQ2FwU3R5bGUpXG4gICAgICAmJiAoYS5ib3JkZXJEYXNoID09PSBiLmJvcmRlckRhc2gpXG4gICAgICAmJiAoYS5ib3JkZXJEYXNoT2Zmc2V0ID09PSBiLmJvcmRlckRhc2hPZmZzZXQpXG4gICAgICAmJiAoYS5ib3JkZXJKb2luU3R5bGUgPT09IGIuYm9yZGVySm9pblN0eWxlKVxuICAgICAgJiYgKGEucG9pbnRCb3JkZXJDb2xvciA9PT0gYi5wb2ludEJvcmRlckNvbG9yKVxuICAgICAgJiYgKGEucG9pbnRCYWNrZ3JvdW5kQ29sb3IgPT09IGIucG9pbnRCYWNrZ3JvdW5kQ29sb3IpXG4gICAgICAmJiAoYS5wb2ludEJvcmRlcldpZHRoID09PSBiLnBvaW50Qm9yZGVyV2lkdGgpXG4gICAgICAmJiAoYS5wb2ludFJhZGl1cyA9PT0gYi5wb2ludFJhZGl1cylcbiAgICAgICYmIChhLnBvaW50SG92ZXJSYWRpdXMgPT09IGIucG9pbnRIb3ZlclJhZGl1cylcbiAgICAgICYmIChhLnBvaW50SGl0UmFkaXVzID09PSBiLnBvaW50SGl0UmFkaXVzKVxuICAgICAgJiYgKGEucG9pbnRIb3ZlckJhY2tncm91bmRDb2xvciA9PT0gYi5wb2ludEhvdmVyQmFja2dyb3VuZENvbG9yKVxuICAgICAgJiYgKGEucG9pbnRIb3ZlckJvcmRlckNvbG9yID09PSBiLnBvaW50SG92ZXJCb3JkZXJDb2xvcilcbiAgICAgICYmIChhLnBvaW50SG92ZXJCb3JkZXJXaWR0aCA9PT0gYi5wb2ludEhvdmVyQm9yZGVyV2lkdGgpXG4gICAgICAmJiAoYS5wb2ludFN0eWxlID09PSBiLnBvaW50U3R5bGUpXG4gICAgICAmJiAoYS5ob3ZlckJhY2tncm91bmRDb2xvciA9PT0gYi5ob3ZlckJhY2tncm91bmRDb2xvcilcbiAgICAgICYmIChhLmhvdmVyQm9yZGVyQ29sb3IgPT09IGIuaG92ZXJCb3JkZXJDb2xvcilcbiAgICAgICYmIChhLmhvdmVyQm9yZGVyV2lkdGggPT09IGIuaG92ZXJCb3JkZXJXaWR0aClcbiAgICAgIDtcbiAgfVxuXG4gIHVwZGF0ZUNvbG9ycygpIHtcbiAgICB0aGlzLmRhdGFzZXRzLmZvckVhY2goKGVsbSwgaW5kZXgpID0+IHtcbiAgICAgIGlmICh0aGlzLmNvbG9ycyAmJiB0aGlzLmNvbG9yc1tpbmRleF0pIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlbG0sIHRoaXMuY29sb3JzW2luZGV4XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBPYmplY3QuYXNzaWduKGVsbSwgZ2V0Q29sb3JzKHRoaXMuY2hhcnRUeXBlLCBpbmRleCwgZWxtLmRhdGEubGVuZ3RoKSwgeyAuLi5lbG0gfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGxldCB1cGRhdGVSZXF1aXJlZCA9IFVwZGF0ZVR5cGUuRGVmYXVsdDtcbiAgICBjb25zdCB3YW50VXBkYXRlID0gKHg6IFVwZGF0ZVR5cGUpID0+IHtcbiAgICAgIHVwZGF0ZVJlcXVpcmVkID0geCA+IHVwZGF0ZVJlcXVpcmVkID8geCA6IHVwZGF0ZVJlcXVpcmVkO1xuICAgIH07XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgY2hhbmdlcyBhcmUgaW4gdGhlIGRhdGEgb3IgZGF0YXNldHMgb3IgbGFiZWxzIG9yIGxlZ2VuZFxuXG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2RhdGEnKSAmJiBjaGFuZ2VzLmRhdGEuY3VycmVudFZhbHVlKSB7XG4gICAgICB0aGlzLnByb3BhZ2F0ZURhdGFUb0RhdGFzZXRzKGNoYW5nZXMuZGF0YS5jdXJyZW50VmFsdWUpO1xuXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZGF0YXNldHMnKSAmJiBjaGFuZ2VzLmRhdGFzZXRzLmN1cnJlbnRWYWx1ZSkge1xuICAgICAgdGhpcy5wcm9wYWdhdGVEYXRhc2V0c1RvRGF0YShjaGFuZ2VzLmRhdGFzZXRzLmN1cnJlbnRWYWx1ZSk7XG5cbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KCdsYWJlbHMnKSkge1xuICAgICAgaWYgKHRoaXMuY2hhcnQpIHtcbiAgICAgICAgdGhpcy5jaGFydC5kYXRhLmxhYmVscyA9IGNoYW5nZXMubGFiZWxzLmN1cnJlbnRWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2xlZ2VuZCcpKSB7XG4gICAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgICB0aGlzLmNoYXJ0LmNvbmZpZy5vcHRpb25zLmxlZ2VuZC5kaXNwbGF5ID0gY2hhbmdlcy5sZWdlbmQuY3VycmVudFZhbHVlO1xuICAgICAgICB0aGlzLmNoYXJ0LmdlbmVyYXRlTGVnZW5kKCk7XG4gICAgICB9XG5cbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KCdvcHRpb25zJykpIHtcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5SZWZyZXNoKTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHVwZGF0ZVJlcXVpcmVkIGFzIFVwZGF0ZVR5cGUpIHtcbiAgICAgIGNhc2UgVXBkYXRlVHlwZS5VcGRhdGU6XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBVcGRhdGVUeXBlLlJlZnJlc2g6XG4gICAgICBjYXNlIFVwZGF0ZVR5cGUuRGVmYXVsdDpcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgdGhpcy5jaGFydC5kZXN0cm95KCk7XG4gICAgICB0aGlzLmNoYXJ0ID0gdm9pZCAwO1xuICAgIH1cbiAgICB0aGlzLnN1YnMuZm9yRWFjaCh4ID0+IHgudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlKGR1cmF0aW9uPzogYW55LCBsYXp5PzogYW55KSB7XG4gICAgaWYgKHRoaXMuY2hhcnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0LnVwZGF0ZShkdXJhdGlvbiwgbGF6eSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGhpZGVEYXRhc2V0KGluZGV4OiBudW1iZXIsIGhpZGRlbjogYm9vbGVhbikge1xuICAgIHRoaXMuY2hhcnQuZ2V0RGF0YXNldE1ldGEoaW5kZXgpLmhpZGRlbiA9IGhpZGRlbjtcbiAgICB0aGlzLmNoYXJ0LnVwZGF0ZSgpO1xuICB9XG5cbiAgcHVibGljIGlzRGF0YXNldEhpZGRlbihpbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2hhcnQuZ2V0RGF0YXNldE1ldGEoaW5kZXgpLmhpZGRlbjtcbiAgfVxuXG4gIHB1YmxpYyB0b0Jhc2U2NEltYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY2hhcnQudG9CYXNlNjRJbWFnZSgpO1xuICB9XG5cbiAgcHVibGljIGdldENoYXJ0Q29uZmlndXJhdGlvbigpOiBjaGFydEpzLkNoYXJ0Q29uZmlndXJhdGlvbiB7XG4gICAgY29uc3QgZGF0YXNldHMgPSB0aGlzLmdldERhdGFzZXRzKCk7XG5cbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKTtcbiAgICBpZiAodGhpcy5sZWdlbmQgPT09IGZhbHNlKSB7XG4gICAgICBvcHRpb25zLmxlZ2VuZCA9IHsgZGlzcGxheTogZmFsc2UgfTtcbiAgICB9XG4gICAgLy8gaG9vayBmb3Igb25Ib3ZlciBhbmQgb25DbGljayBldmVudHNcbiAgICBvcHRpb25zLmhvdmVyID0gb3B0aW9ucy5ob3ZlciB8fCB7fTtcbiAgICBpZiAoIW9wdGlvbnMuaG92ZXIub25Ib3Zlcikge1xuICAgICAgb3B0aW9ucy5ob3Zlci5vbkhvdmVyID0gKGV2ZW50OiBNb3VzZUV2ZW50LCBhY3RpdmU6IHt9W10pID0+IHtcbiAgICAgICAgaWYgKGFjdGl2ZSAmJiAhYWN0aXZlLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoYXJ0SG92ZXIuZW1pdCh7IGV2ZW50LCBhY3RpdmUgfSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghb3B0aW9ucy5vbkNsaWNrKSB7XG4gICAgICBvcHRpb25zLm9uQ2xpY2sgPSAoZXZlbnQ/OiBNb3VzZUV2ZW50LCBhY3RpdmU/OiB7fVtdKSA9PiB7XG4gICAgICAgIHRoaXMuY2hhcnRDbGljay5lbWl0KHsgZXZlbnQsIGFjdGl2ZSB9KTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgbWVyZ2VkT3B0aW9ucyA9IHRoaXMuc21hcnRNZXJnZShvcHRpb25zLCB0aGlzLnRoZW1lU2VydmljZS5nZXRDb2xvcnNjaGVtZXNPcHRpb25zKCkpO1xuXG4gICAgY29uc3QgY2hhcnRDb25maWc6IGNoYXJ0SnMuQ2hhcnRDb25maWd1cmF0aW9uID0ge1xuICAgICAgdHlwZTogdGhpcy5jaGFydFR5cGUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGxhYmVsczogdGhpcy5sYWJlbHMgfHwgW10sXG4gICAgICAgIGRhdGFzZXRzXG4gICAgICB9LFxuICAgICAgcGx1Z2luczogdGhpcy5wbHVnaW5zLFxuICAgICAgb3B0aW9uczogbWVyZ2VkT3B0aW9ucyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGNoYXJ0Q29uZmlnO1xuICB9XG5cbiAgcHVibGljIGdldENoYXJ0QnVpbGRlcihjdHg6IHN0cmluZy8qLCBkYXRhOmFueVtdLCBvcHRpb25zOmFueSovKTogQ2hhcnQge1xuICAgIGNvbnN0IGNoYXJ0Q29uZmlnID0gdGhpcy5nZXRDaGFydENvbmZpZ3VyYXRpb24oKTtcbiAgICByZXR1cm4gbmV3IGNoYXJ0SnMuQ2hhcnQoY3R4LCBjaGFydENvbmZpZyk7XG4gIH1cblxuICBzbWFydE1lcmdlKG9wdGlvbnM6IGFueSwgb3ZlcnJpZGVzOiBhbnksIGxldmVsOiBudW1iZXIgPSAwKTogYW55IHtcbiAgICBpZiAobGV2ZWwgPT09IDApIHtcbiAgICAgIG9wdGlvbnMgPSBjbG9uZURlZXAob3B0aW9ucyk7XG4gICAgfVxuICAgIGNvbnN0IGtleXNUb1VwZGF0ZSA9IE9iamVjdC5rZXlzKG92ZXJyaWRlcyk7XG4gICAga2V5c1RvVXBkYXRlLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG92ZXJyaWRlc1trZXldKSkge1xuICAgICAgICBjb25zdCBhcnJheUVsZW1lbnRzID0gb3B0aW9uc1trZXldO1xuICAgICAgICBpZiAoYXJyYXlFbGVtZW50cykge1xuICAgICAgICAgIGFycmF5RWxlbWVudHMuZm9yRWFjaChyID0+IHtcbiAgICAgICAgICAgIHRoaXMuc21hcnRNZXJnZShyLCBvdmVycmlkZXNba2V5XVswXSwgbGV2ZWwgKyAxKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgKG92ZXJyaWRlc1trZXldKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgaWYgKCEoa2V5IGluIG9wdGlvbnMpKSB7XG4gICAgICAgICAgb3B0aW9uc1trZXldID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zbWFydE1lcmdlKG9wdGlvbnNba2V5XSwgb3ZlcnJpZGVzW2tleV0sIGxldmVsICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zW2tleV0gPSBvdmVycmlkZXNba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAobGV2ZWwgPT09IDApIHtcbiAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNNdWx0aUxpbmVMYWJlbChsYWJlbDogTGFiZWwpOiBsYWJlbCBpcyBNdWx0aUxpbmVMYWJlbCB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkobGFiZWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBqb2luTGFiZWwobGFiZWw6IExhYmVsKTogc3RyaW5nIHtcbiAgICBpZiAoIWxhYmVsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNNdWx0aUxpbmVMYWJlbChsYWJlbCkpIHtcbiAgICAgIHJldHVybiBsYWJlbC5qb2luKCcgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBsYWJlbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHByb3BhZ2F0ZURhdGFzZXRzVG9EYXRhKGRhdGFzZXRzOiBjaGFydEpzLkNoYXJ0RGF0YVNldHNbXSkge1xuICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YXNldHMubWFwKHIgPT4gci5kYXRhKTtcbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgdGhpcy5jaGFydC5kYXRhLmRhdGFzZXRzID0gZGF0YXNldHM7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlQ29sb3JzKCk7XG4gIH1cblxuICBwcml2YXRlIHByb3BhZ2F0ZURhdGFUb0RhdGFzZXRzKG5ld0RhdGFWYWx1ZXM6IFNpbmdsZU9yTXVsdGlEYXRhU2V0KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNNdWx0aURhdGFTZXQobmV3RGF0YVZhbHVlcykpIHtcbiAgICAgIGlmICh0aGlzLmRhdGFzZXRzICYmIG5ld0RhdGFWYWx1ZXMubGVuZ3RoID09PSB0aGlzLmRhdGFzZXRzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmRhdGFzZXRzLmZvckVhY2goKGRhdGFzZXQsIGk6IG51bWJlcikgPT4ge1xuICAgICAgICAgIGRhdGFzZXQuZGF0YSA9IG5ld0RhdGFWYWx1ZXNbaV07XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kYXRhc2V0cyA9IG5ld0RhdGFWYWx1ZXMubWFwKChkYXRhOiBudW1iZXJbXSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgICAgIHJldHVybiB7IGRhdGEsIGxhYmVsOiB0aGlzLmpvaW5MYWJlbCh0aGlzLmxhYmVsc1tpbmRleF0pIHx8IGBMYWJlbCAke2luZGV4fWAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICAgICAgdGhpcy5jaGFydC5kYXRhLmRhdGFzZXRzID0gdGhpcy5kYXRhc2V0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXRoaXMuZGF0YXNldHMpIHtcbiAgICAgICAgdGhpcy5kYXRhc2V0cyA9IFt7IGRhdGE6IG5ld0RhdGFWYWx1ZXMgfV07XG4gICAgICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICAgICAgdGhpcy5jaGFydC5kYXRhLmRhdGFzZXRzID0gdGhpcy5kYXRhc2V0cztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kYXRhc2V0c1swXS5kYXRhID0gbmV3RGF0YVZhbHVlcztcbiAgICAgICAgdGhpcy5kYXRhc2V0cy5zcGxpY2UoMSk7IC8vIFJlbW92ZSBhbGwgZWxlbWVudHMgYnV0IHRoZSBmaXJzdFxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnVwZGF0ZUNvbG9ycygpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc011bHRpRGF0YVNldChkYXRhOiBTaW5nbGVPck11bHRpRGF0YVNldCk6IGRhdGEgaXMgTXVsdGlEYXRhU2V0IHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShkYXRhWzBdKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGF0YXNldHMoKSB7XG4gICAgaWYgKCF0aGlzLmRhdGFzZXRzICYmICF0aGlzLmRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgbmctY2hhcnRzIGNvbmZpZ3VyYXRpb24gZXJyb3IsIGRhdGEgb3IgZGF0YXNldHMgZmllbGQgYXJlIHJlcXVpcmVkIHRvIHJlbmRlciBjaGFydCAke3RoaXMuY2hhcnRUeXBlfWApO1xuICAgIH1cblxuICAgIC8vIElmIGBkYXRhc2V0c2AgaXMgZGVmaW5lZCwgdXNlIGl0IG92ZXIgdGhlIGBkYXRhYCBwcm9wZXJ0eS5cbiAgICBpZiAodGhpcy5kYXRhc2V0cykge1xuICAgICAgdGhpcy5wcm9wYWdhdGVEYXRhc2V0c1RvRGF0YSh0aGlzLmRhdGFzZXRzKTtcbiAgICAgIHJldHVybiB0aGlzLmRhdGFzZXRzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRhdGEpIHtcbiAgICAgIHRoaXMucHJvcGFnYXRlRGF0YVRvRGF0YXNldHModGhpcy5kYXRhKTtcbiAgICAgIHJldHVybiB0aGlzLmRhdGFzZXRzO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaCgpIHtcbiAgICAvLyBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5yZXNwb25zaXZlKSB7XG4gICAgLy8gICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVmcmVzaCgpLCA1MCk7XG4gICAgLy8gfVxuXG4gICAgLy8gdG9kbzogcmVtb3ZlIHRoaXMgbGluZSwgaXQgaXMgcHJvZHVjaW5nIGZsaWNrZXJpbmdcbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgdGhpcy5jaGFydC5kZXN0cm95KCk7XG4gICAgICB0aGlzLmNoYXJ0ID0gdm9pZCAwO1xuICAgIH1cbiAgICBpZiAodGhpcy5jdHgpIHtcbiAgICAgIHRoaXMuY2hhcnQgPSB0aGlzLmdldENoYXJ0QnVpbGRlcih0aGlzLmN0eC8qLCBkYXRhLCB0aGlzLm9wdGlvbnMqLyk7XG4gICAgfVxuICB9XG59XG4iXX0=