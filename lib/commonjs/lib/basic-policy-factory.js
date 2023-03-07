import { AnyCoveragePolicy } from "./policy/any-coverage-policy";
import { AnyDeltaCoveragePolicy } from "./policy/any-delta-coverage-policy";
import { DeltaCoveragePolicy } from "./policy/delta-coverage-policy";
import { MinCoveragePolicy } from "./policy/min-coverage-policy";
import { MaxLiteralTestPolicy } from "./policy/max-literal-test-policy";
import { MinLiteralTestPolicy } from "./policy/min-literal-test-policy";
import { MaxPercentageTestPolicy } from "./policy/max-percentage-test-policy";
import { MinPercentageTestPolicy } from "./policy/min-percentage-test-policy";
class BasicPolicyFactory {
    generate({ name, target, data }) {
        switch (data.type) {
            case "any-coverage-policy":
                return new AnyCoveragePolicy(name, target, data);
            case "any-delta-coverage-policy":
                return new AnyDeltaCoveragePolicy(name, target, data);
            case "delta-coverage-policy":
                return new DeltaCoveragePolicy(name, target, data);
            case "min-coverage-policy":
                return new MinCoveragePolicy(name, target, data);
            case "max-literal-test-policy":
                return new MaxLiteralTestPolicy(name, target, data);
            case "min-literal-test-policy":
                return new MinLiteralTestPolicy(name, target, data);
            case "max-percentage-test-policy":
                return new MaxPercentageTestPolicy(name, target, data);
            case "min-percentage-test-policy":
                return new MinPercentageTestPolicy(name, target, data);
            default:
                throw new Error(`Unknown policy type: ${data.type}`);
        }
    }
}
export { BasicPolicyFactory };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtcG9saWN5LWZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2Jhc2ljLXBvbGljeS1mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQzlFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRTlFLE1BQU0sa0JBQWtCO0lBQ3RCLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFnQjtRQUMzQyxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDakIsS0FBSyxxQkFBcUI7Z0JBQ3hCLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25ELEtBQUssMkJBQTJCO2dCQUM5QixPQUFPLElBQUksc0JBQXNCLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN4RCxLQUFLLHVCQUF1QjtnQkFDMUIsT0FBTyxJQUFJLG1CQUFtQixDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckQsS0FBSyxxQkFBcUI7Z0JBQ3hCLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25ELEtBQUsseUJBQXlCO2dCQUM1QixPQUFPLElBQUksb0JBQW9CLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0RCxLQUFLLHlCQUF5QjtnQkFDNUIsT0FBTyxJQUFJLG9CQUFvQixDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEQsS0FBSyw0QkFBNEI7Z0JBQy9CLE9BQU8sSUFBSSx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pELEtBQUssNEJBQTRCO2dCQUMvQixPQUFPLElBQUksdUJBQXVCLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6RDtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF5QixJQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNqRTtJQUNILENBQUM7Q0FDRjtBQUVELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9saWN5RmFjdG9yeSB9IGZyb20gXCIuL2ludGVyZmFjZS9wb2xpY3ktZmFjdG9yeVwiO1xuaW1wb3J0IHsgUG9saWN5Q29uZmlnIH0gZnJvbSBcIi4vcG9saWN5LWNvbmZpZ1wiO1xuaW1wb3J0IHsgUG9saWN5IH0gZnJvbSBcIi4vaW50ZXJmYWNlL3BvbGljeVwiO1xuaW1wb3J0IHsgQW55Q292ZXJhZ2VQb2xpY3kgfSBmcm9tIFwiLi9wb2xpY3kvYW55LWNvdmVyYWdlLXBvbGljeVwiO1xuaW1wb3J0IHsgQW55RGVsdGFDb3ZlcmFnZVBvbGljeSB9IGZyb20gXCIuL3BvbGljeS9hbnktZGVsdGEtY292ZXJhZ2UtcG9saWN5XCI7XG5pbXBvcnQgeyBEZWx0YUNvdmVyYWdlUG9saWN5IH0gZnJvbSBcIi4vcG9saWN5L2RlbHRhLWNvdmVyYWdlLXBvbGljeVwiO1xuaW1wb3J0IHsgTWluQ292ZXJhZ2VQb2xpY3kgfSBmcm9tIFwiLi9wb2xpY3kvbWluLWNvdmVyYWdlLXBvbGljeVwiO1xuaW1wb3J0IHsgTWF4TGl0ZXJhbFRlc3RQb2xpY3kgfSBmcm9tIFwiLi9wb2xpY3kvbWF4LWxpdGVyYWwtdGVzdC1wb2xpY3lcIjtcbmltcG9ydCB7IE1pbkxpdGVyYWxUZXN0UG9saWN5IH0gZnJvbSBcIi4vcG9saWN5L21pbi1saXRlcmFsLXRlc3QtcG9saWN5XCI7XG5pbXBvcnQgeyBNYXhQZXJjZW50YWdlVGVzdFBvbGljeSB9IGZyb20gXCIuL3BvbGljeS9tYXgtcGVyY2VudGFnZS10ZXN0LXBvbGljeVwiO1xuaW1wb3J0IHsgTWluUGVyY2VudGFnZVRlc3RQb2xpY3kgfSBmcm9tIFwiLi9wb2xpY3kvbWluLXBlcmNlbnRhZ2UtdGVzdC1wb2xpY3lcIjtcblxuY2xhc3MgQmFzaWNQb2xpY3lGYWN0b3J5IGltcGxlbWVudHMgUG9saWN5RmFjdG9yeSB7XG4gIGdlbmVyYXRlKHsgbmFtZSwgdGFyZ2V0LCBkYXRhIH06IFBvbGljeUNvbmZpZyk6IFBvbGljeSB7XG4gICAgc3dpdGNoIChkYXRhLnR5cGUpIHtcbiAgICAgIGNhc2UgXCJhbnktY292ZXJhZ2UtcG9saWN5XCI6XG4gICAgICAgIHJldHVybiBuZXcgQW55Q292ZXJhZ2VQb2xpY3kobmFtZSwgdGFyZ2V0LCBkYXRhKTtcbiAgICAgIGNhc2UgXCJhbnktZGVsdGEtY292ZXJhZ2UtcG9saWN5XCI6XG4gICAgICAgIHJldHVybiBuZXcgQW55RGVsdGFDb3ZlcmFnZVBvbGljeShuYW1lLCB0YXJnZXQsIGRhdGEpO1xuICAgICAgY2FzZSBcImRlbHRhLWNvdmVyYWdlLXBvbGljeVwiOlxuICAgICAgICByZXR1cm4gbmV3IERlbHRhQ292ZXJhZ2VQb2xpY3kobmFtZSwgdGFyZ2V0LCBkYXRhKTtcbiAgICAgIGNhc2UgXCJtaW4tY292ZXJhZ2UtcG9saWN5XCI6XG4gICAgICAgIHJldHVybiBuZXcgTWluQ292ZXJhZ2VQb2xpY3kobmFtZSwgdGFyZ2V0LCBkYXRhKTtcbiAgICAgIGNhc2UgXCJtYXgtbGl0ZXJhbC10ZXN0LXBvbGljeVwiOlxuICAgICAgICByZXR1cm4gbmV3IE1heExpdGVyYWxUZXN0UG9saWN5KG5hbWUsIHRhcmdldCwgZGF0YSk7XG4gICAgICBjYXNlIFwibWluLWxpdGVyYWwtdGVzdC1wb2xpY3lcIjpcbiAgICAgICAgcmV0dXJuIG5ldyBNaW5MaXRlcmFsVGVzdFBvbGljeShuYW1lLCB0YXJnZXQsIGRhdGEpO1xuICAgICAgY2FzZSBcIm1heC1wZXJjZW50YWdlLXRlc3QtcG9saWN5XCI6XG4gICAgICAgIHJldHVybiBuZXcgTWF4UGVyY2VudGFnZVRlc3RQb2xpY3kobmFtZSwgdGFyZ2V0LCBkYXRhKTtcbiAgICAgIGNhc2UgXCJtaW4tcGVyY2VudGFnZS10ZXN0LXBvbGljeVwiOlxuICAgICAgICByZXR1cm4gbmV3IE1pblBlcmNlbnRhZ2VUZXN0UG9saWN5KG5hbWUsIHRhcmdldCwgZGF0YSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcG9saWN5IHR5cGU6ICR7KGRhdGEgYXMgYW55KS50eXBlfWApO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBCYXNpY1BvbGljeUZhY3RvcnkgfTtcbiJdfQ==