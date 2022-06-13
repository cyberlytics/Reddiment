import Context from "./context";
import Info from "./info";

const JobQueryResolver = {
    jobs: (parent: {}, args: {}, context: Context, info: Info) => {
        // Currently static
        return [
            'r/wallstreetbets',
        ];
    },
};


export { JobQueryResolver };