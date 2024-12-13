import type {Route} from "vue-router";
import path from "path";

// Находим необходимые фалы по роуту
export const findFilesRoute = (route?: Route): string[] => {
    const matched = route?.matched || [];
    return [...new Set(matched.reduce((ac, row) => {
        const files = searchFiles(row.components);
        ac.push(...files);
        return ac;
    }, [] as string[]))];
}

// Рекурсивный поиск фалов в компонентах
const searchFiles = (components: Record<string, any>, files: string[] = [], level = 0) => {
    Object.keys(components).forEach((key) => {
        const current = components[key];
        if(current.__file) { // Компонент без потомков
            files.push(path.relative(path.resolve(), current.__file));
        }
        if(current.options) {
            if(current.options.__file) {
                files.push(path.relative(path.resolve(), current.options.__file));
            }
            if(current.options.components && level < 2) {
                searchFiles(current.options.components, files, ++level);
            }
        }
    });
    return files;
}

//
// cmp?.options?.__file
//

// route?.matched
// default.__file
// default.options.__file
// default.options.components
// Если обект включает другие обекты - options.__file options.components
/*
 components: {
    Header: {
      components: [Object],
      data: [Function: data],
      computed: [Object],
      watch: [Object],
      name: 'Header',
      render: [Function: render24],
      staticRenderFns: [],
      _compiled: true,
      _Ctor: [Object]
    },
    Footer: {
      components: [Object],
      data: [Function: data],
      computed: [Object],
      name: 'Footer',
      render: [Function: render26],
      staticRenderFns: [],
      _compiled: true,
      _Ctor: [Object]
    },
    Breadcrumbs: {
      name: 'Breadcrumbs',
      components: [Object],
      props: [Object],
      computed: [Object],
      render: [Function: render27],
      staticRenderFns: [],
      _compiled: true,
      _Ctor: [Object]
    },
    BaseMessage: {
      model: [Object],
      props: [Object],
      mounted: [Function: mounted],
      data: [Function: data],
      computed: [Object],
      watch: [Object],
      methods: [Object],
      name: 'EstokBaseMessage',
      render: [Function: render28],
      staticRenderFns: [],
      _compiled: true,
      _Ctor: [Object]
    },
    AddHomeIos: {
      mounted: [Function: mounted],
      data: [Function: data],
      methods: [Object],
      name: 'AddHomeIos',
      render: [Function: render29],
      staticRenderFns: [],
      _compiled: true,
      _Ctor: [Object]
    },
    PromPopup: {
      components: [Object],
      data: [Function: data],
      mounted: [Function: mounted],
      methods: [Object],
      render: [Function: render30],
      staticRenderFns: [],
      _compiled: true,
      _scopeId: 'data-v-90b4bae4'
    }
  },
 */