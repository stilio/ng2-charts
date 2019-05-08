/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
var ThemeService = /** @class */ (function () {
    function ThemeService() {
        this.pColorschemesOptions = {};
        this.colorschemesOptions = new BehaviorSubject({});
    }
    /**
     * @param {?} options
     * @return {?}
     */
    ThemeService.prototype.setColorschemesOptions = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        this.pColorschemesOptions = options;
        this.colorschemesOptions.next(options);
    };
    /**
     * @return {?}
     */
    ThemeService.prototype.getColorschemesOptions = /**
     * @return {?}
     */
    function () {
        return this.pColorschemesOptions;
    };
    ThemeService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    ThemeService.ctorParameters = function () { return []; };
    /** @nocollapse */ ThemeService.ngInjectableDef = i0.defineInjectable({ factory: function ThemeService_Factory() { return new ThemeService(); }, token: ThemeService, providedIn: "root" });
    return ThemeService;
}());
export { ThemeService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    ThemeService.prototype.pColorschemesOptions;
    /** @type {?} */
    ThemeService.prototype.colorschemesOptions;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1jaGFydHMvIiwic291cmNlcyI6WyJsaWIvdGhlbWUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUd2QztJQU9FO1FBSFEseUJBQW9CLEdBQWlCLEVBQUUsQ0FBQztRQUN6Qyx3QkFBbUIsR0FBRyxJQUFJLGVBQWUsQ0FBZSxFQUFFLENBQUMsQ0FBQztJQUVuRCxDQUFDOzs7OztJQUVqQiw2Q0FBc0I7Ozs7SUFBdEIsVUFBdUIsT0FBcUI7UUFDMUMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLE9BQU8sQ0FBQztRQUNwQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Ozs7SUFFRCw2Q0FBc0I7OztJQUF0QjtRQUNFLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDO0lBQ25DLENBQUM7O2dCQWhCRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7Ozt1QkFORDtDQXFCQyxBQWpCRCxJQWlCQztTQWRZLFlBQVk7Ozs7OztJQUN2Qiw0Q0FBZ0Q7O0lBQ2hELDJDQUFtRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQ2hhcnRPcHRpb25zIH0gZnJvbSAnY2hhcnQuanMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBUaGVtZVNlcnZpY2Uge1xuICBwcml2YXRlIHBDb2xvcnNjaGVtZXNPcHRpb25zOiBDaGFydE9wdGlvbnMgPSB7fTtcbiAgcHVibGljIGNvbG9yc2NoZW1lc09wdGlvbnMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PENoYXJ0T3B0aW9ucz4oe30pO1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgc2V0Q29sb3JzY2hlbWVzT3B0aW9ucyhvcHRpb25zOiBDaGFydE9wdGlvbnMpIHtcbiAgICB0aGlzLnBDb2xvcnNjaGVtZXNPcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmNvbG9yc2NoZW1lc09wdGlvbnMubmV4dChvcHRpb25zKTtcbiAgfVxuXG4gIGdldENvbG9yc2NoZW1lc09wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMucENvbG9yc2NoZW1lc09wdGlvbnM7XG4gIH1cbn1cbiJdfQ==