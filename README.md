
# 前端常用工具:

## 安裝
```bash
yarn add @gdknot/frontend_common
```
## Feature
提供以下常用表單驗證工具
- 使用者自定義「驗證規則」／「驗證子」
- 套用「驗證規則鏈」至表單欄位
- 「驗證規則」支援雙欄位連結
- 提供 ui 實作常用事件
  - input
  - focus
  - unfocused

# Table of Content
- [defineValidators:](#validators)
- [defineFieldRules:](#rules)
- [defineFieldConfigs:](#configs)
- [實作 Form Model:](#formModelImpl)




# Validators:
# Writing pseudo code for api - 測試API工具

## CRUD

有時開發時程不允許寫單元測試，只好透過寫假Api餵假資料，CRUD 提供單一Api所需的 Create/Read/Update/Delete 所需的界面。


```ts
export type TSuccessResponse = {
    succeed: boolean;
};

export type TDataResponse<T> = {
    data: T;
    pager?: TPager | null | undefined;
};

/**
 * @param dataList 取得該列表所有資料
 * @param updater  更新該列表所有資料 
 * @param itemGen 依 identity 由列表資料取得該 item
 */
const CRUD = <T extends {id: string|number}>(
  dataList: TOptional<TDataResponse<any[]>>,
  updater:(data: any[])=>void,
  itemGen: (idx: number)=>T
): {
    add: (payload: T)=>Promise<TSuccessResponse>,
    del: (payload: T)=>Promise<TSuccessResponse>,
    edit: (payload: T)=>Promise<TSuccessResponse>,
    get: (payload?: TPagerPayload)=>Promise<TDataResponse<any[]>>,
  }
```

### Example
```ts
const api = {
    news: {
        ...CRUD<NewsItem>(
            DB.getNewsList!,
            data => {
                DB.getNewsList!.data = data;
            },
            idx => {
                const result: NewsItem = {
                    is_publish: true,
                    author: DB.users[range(0, DB.users.length - 1)].username!,
                    content: `${idx} - content`,
                    title: `Loream Ipsum-${idx} dolo sit amet`
                };
                return result;
            }
        )
    }
}

api.news.add(payload);
api.news.del(payload);
api.news.edit(payload);
api.news.get(pagerPayload)
```

# Rules:
## is - 型別推斷工具
```ts
describe("is", () => {
    describe("is.array", () => {
      test("[]", function () {
        expect(is.array([])).toBeTruthy();
      });
      test("new Array()", function () {
        expect(is.array(new Array())).toBeTruthy();
      });
      test("is refimpl", function () {});
    });

    describe("is.undefined", () => {
      test("'undefined' do not count undefined string", function () {
        expect(is.undefined("undefined")).toBeFalsy();
      });
      test("'undefined' count undefined string", function () {
        expect(is.undefined("undefined", true)).toBeTruthy();
      });
      test("undefined", function () {
        expect(is.undefined(undefined)).toBeTruthy();
      });
      test("null", function () {
        expect(is.undefined(null)).toBeTruthy();
      });
    });

    describe("is.null", () => {
      test("'null' do not count null string", function () {
        expect(is.null("null")).toBeFalsy();
      });
      test("'null' count null string", function () {
        expect(is.null("null", true)).toBeTruthy();
      });
      test("undefined", function () {
        expect(is.null(undefined)).toBeTruthy();
      });
      test("null", function () {
        expect(is.null(null)).toBeTruthy();
      });
    });

    describe("is.empty", () => {
      test("{}", function () {
        expect(is.empty({})).toBeTruthy();
      });
      test("{a: 1}", function () {
        expect(is.empty({ a: 1 })).toBeFalsy();
      });
      test("[]", function () {
        expect(is.empty([])).toBeTruthy();
      });
      test("[1]", function () {
        expect(is.empty([1])).toBeFalsy();
      });
      test("null", function () {
        expect(is.empty(null)).toBeTruthy();
      });
      test("undefined", function () {
        expect(is.empty(undefined)).toBeTruthy();
      });
      test("NaN", function () {
        expect(is.empty(NaN)).toBeTruthy();
      });
      test("''", function () {
        expect(is.empty("")).toBeTruthy();
      });
      test("0", function () {
        expect(is.empty("0")).toBeFalsy();
      });
      test("false", function () {
        expect(is.empty(false)).toBeFalsy();
      });
    });
  });
```


## flattenInstance - 平面化 class，用於 vue 寫 OOP
```ts
/**
 *  flattenInstance 平面化 class，用於 vue 寫 OOP
 *  vue 若傳入有繼承關係的類別（class)，其繼承關係會消失
 *  因為 vue 不會讀取 prototype 層的內容
 *
 *  如 A extends Base, 而 
 *  - Base 有 methodBase, propBase, propX
 *  - A 有 propA, methodA, propX
 *  當我們將 instance A 傳給 vue 物件化後
 *  vue 會無視 methodBase, propBase, 因為 methodBase/propBase 
 *  在 A 的 prototype 層
 *
 *  flattenInstance 作用為將可存取的所有 methods / property
 *  寫入當前的 class, 使得 A 繼承至 Base 的 methodBase, propBase 平面化至 A
 *
 *  @param rule 平面化規則，預設為 
 *              constructor 不考慮
 *              method name 開頭為 "_" 不考慮
 * */
function flattenInstance(
    obj: any, 
    overrideReadonly: boolean = false, 
    rule?: (name: string) => boolean, 
    onError?: (err: string)=>void
) 
```
```ts
describe("flattenInstance", () => {
    class BaseCls {
      baseProp: string = "baseProp";
      constructor() {}
      get basename(): string {
        return "BaseCls";
      }
      baseMethod(): string {
        return "BaseMethod";
      }
    }

    class SubClass extends BaseCls {
      subProp: string = "subProp";
      constructor() {
        super();
      }
      get subname(): string {
        return "SubName";
      }
      subMethod(): string {
        return "SubMethod";
      }
    }

    let subFlatten!: SubClass;
    let subOrig!: SubClass;

    beforeAll(() => {
      subOrig = new SubClass();
      subFlatten = new SubClass();
      flattenInstance(subFlatten, true);
    });

    test("expect accessing subname returned as a descriptor", () => {
      expect(
        Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(subOrig),
          "subname"
        )
      ).toBeInstanceOf(Object);
      expect(
        Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(subOrig),
          "subname"
        )?.set
      ).toBe(undefined);
    });

    test("expect flattenInstance throws, since subname is readonly", () => {
      expect(() => flattenInstance(subOrig)).toThrow(
        "Cannot set property subname"
      );
      expect(() => {
        //@ts-ignore
        subOrig.subname = 123;
      }).toThrow("Cannot set property subname");
      expect(subOrig.subname).not.toBe(123);
    });

    test("assert accessible properties of non-flattened SubClass", () => {
      expect(getAccessibleProperties(subOrig)).toEqual(
        new Set(["subMethod", "baseMethod", "subname", "basename"])
      );
      //@ts-ignore
      expect(Object.keys(subOrig)).toEqual(["baseProp", "subProp"]);
    });

    test("assert accessible properties of flattened SubClass", () => {
      expect(getAccessibleProperties(subFlatten)).toEqual(
        new Set(["subMethod", "baseMethod", "subname", "basename"])
      );
      //@ts-ignore
      expect(Object.keys(subFlatten)).toEqual([
        "baseProp",
        "subProp",
        "subMethod",
        "baseMethod",
      ]);
    });

    test("override subname, expect value changed", () => {
      //@ts-ignore
      subFlatten.subname = "hello";
      expect(subFlatten.subname).toBe("hello");
    });
  });
});
```

# Form Configs:

## Provider Pattern  
1) 提供 Dependency Provider design pattern，將 dependency以 ident 作為 key 植入 container
2) 提供 Facade Provider design pattern，將 dependency 以 FACADE_KEY 作為 key 植入 container, 為App開發時提供一個入口，以存取所需的一切資料. 
3) 
### Facade Provider (對應Facade Injector)
```ts
type ProviderParams<T> = {
    deps: Partial<T>, 
    merge?: boolean, 
    ident?: string | symbol
};
/**
 *  @params deps dependency 物件值鍵對
 *  @params merge 是否對 provider 所提併的值鍵對進與 container 進行合併 
 *  @params ident 用以識別 container 取值所需要的 key
 *  */
function function provideFacade<T>(option: ProviderParams<T>)
```

#### 不合併 provide 物件 
```ts
const merge = false;
provideFacade({
    deps: {
        source: {
            a: 1
        }
    }, 
    merge
});
// 覆寫
provideFacade({
    deps: {
        source: {
            b: 2
        }
    }, 
    merge
});
const facade = injectFacade();
assert(facade.source.a == undefined);
assert(facade.source.b == 2);
```
#### 合併 provide 物件

```ts
const merge = true;
provideFacade({
    deps:{
        source: {
            a: 1
        }
    }, 
    merge
});

provideFacade({
    deps: {
        source: {b: 2},
        appended: {a: 1}
    },
    merge
}
const facade = injectFacade();
assert(facade.source.a == 1);
assert(facade.source.b == 2);
assert(facade.appended.a == 1);
```

### Dependency Provider(對應 dependency injector)
```ts
type ProviderParams<T> = {
    deps: Partial<T>, 
    merge?: boolean, 
    ident?: string | symbol
};
/**
 *  @params ident 用以識別 container 取值所需要的 key
 *  */
function provideDependency<T>(option: ProviderParams<T>)
```
#### 不指定 Ident
```ts
const merge = true;
provideDependency({deps: {a: 1, source: {a: 2}}, merge});
provideDependency({deps: {b: 3, source: {b: 4}}, merge});
const a = injectDependency("a");
const aOfSource = injectDependency("source.a");
const b = injectDependency("b");
const bOfSource = injectDependency("source.b");
assert(a == 1);
assert(b == 3);
assert(aOfSource == 2);
assert(bOfSource == 4);
```
#### 指定 Ident
```ts
provideDependency({deps: {a: 1, source: {a: 2}}, ident: "a"});
provideDependency({deps: {b: 3, source: {b: 4}}, ident: "b"});
const a = injectDependency("a", "a");
const aOfSource = injectDependency("source.a", "a");
const b = injectDependency("b", "a");
const bOfSource = injectDependency("source.b", "a");
assert(a == 1);
assert(b == undefined);
assert(aOfSource == 2);
assert(bOfSource == undefined);

```

## Injector Pattern
### InjectDependency
```ts
/**
 * Dependency Injector
 * @see {@link injectDependency} 
 * @param ident  
 * @param pathOrName
 */
function injectDependency<T>(pathOrName: string, ident=DEP_KEY): T；

```
### InjectFacade
```ts
/**
 * Dependency Injector
 * 注入 IFacade interface, 對應 provideFacade
  * @see {@link provideDependency}
 * @param ident  
 */
export function injectFacade<T>(ident=FACADE_KEY): T
```



## 應用於 App 上開發
> 以 Domain Driven Design 為架構的 App 為例

**main.ts**
```ts
/**
 * Facade
 * 提供 APP 入口界面，實際上的相依則以 provideFacade 以注入的方式
 * 注入 container 中，其運作方式 同 DI pattern
 * 
 * AppFacade 用來定義 Facade 的型別，以供 typescript 辨示 
 * */
export type AppFacade = 
  FacadeMappers &
  FacadeDateSource &
  FacadeRepository &
  FacadePresentationStore &
  FacadeDomainService;

/**
 * facade 用來存取 Domain Driven Design 架構中的 data source / domain / presentation，這裡只定義型別，進行界面分離， IFacade 內部會以 lazyloading 的方式宣告，直到 facade 第一次實際被使用時，才會進行存取。
 */
export const facade = IFacade<AppFacade>();

const executeAndLog = (msg: string, cb: ()=>void)=>{
  console.group("", `----------${msg}---------`);
  cb();
  console.groupEnd();
}

/**
 *  設定 App 所需要的相依注入
 * */
(function setupDependencies() {
  "use strict";
  console.group("===============JinHao INFO================")
  executeAndLog("APP_PLUGIN", ()=>setupAppPlugins(app, facade));
  // ---------------
  // data source 注入
  executeAndLog("DATE_SERVICES", ()=>setupDataCoreServices(app, facade));
  executeAndLog("MAPPERS", ()=>setupMappers(app, facade));
  executeAndLog("REPOS", ()=>setupRepositories(app, facade));
  // -----------
  // domain 注入
  executeAndLog("DOMAIN_SERVICES", ()=>setupDomainServices(app, facade));
  // ----------------
  // presentation 注入
  executeAndLog("VIEW_STORES", ()=>setupPresentationStores(app, facade, true));
  app.mount("#app");
  executeAndLog("VIEW_STORES", ()=>setupPresentationStores(app, facade, false));
  console.groupEnd();
})();

```

**mappers/index**
```ts
export type FacadeMappers = {
  data: {
    mappers: {
      user: BaseModelMapper<UserEntity, UserDomainModel>;
      announcement: BaseModelMapper<AnnouncementEntity, AnnouncementDomainModel>;
    };
  };
};

export function setupMappers(app: App<Element>, facade: AppFacade) {
  const mergeObject = true;
  provideFacade(
    {
      data: {
        mappers: {
          user: userMapper(),
          announcement: annMapper()
        }
      }
    },
    mergeObject
  );
}
```

**repositories/index**
```ts
export type FacadeRepository = {
  data: {
    repo: {
      user: TUserRepository,
      announcement: TAnnouncementRepository,
      reset: ()=>void
    };
  };
};

// todo: index repositories 統一注入
export function setupRepositories(app: App<Element>, facade: AppFacade) {
  const mergeObject = true;
  const client = facade.data.remoteClient;

  /** repository 設定，注入 */
  const userMapper = facade.data.mappers.user;
  const user = new UserRepositoryImpl(client, userMapper);

  const announcementMapper = facade.data.mappers.announcement;
  const announcement = new AnnouncementRepositoryImpl(client, announcementMapper);
  
  provideFacade({
      data: {
        repo: {
          user,
          announcement,
          reset: ()=>{
            appLocalStorageMgr().clear();
          }
        }
      }
    },
    mergeObject
  );
}
```

**vue或其他地方使用時**
```ts
facade.data.remoteClient....
facade.data.repo...
facade....
```

# Form Model Implementation:

## lazyHolder - lazy loading for objects except function
### description
以 proxy實作 物件 lazy loading
```ts
function LazyHolder<T extends object>(initializer: () => T): T 
```

### 以Locale 為例
以下為例，引用 i18n 時，不用考慮到 createI18n 是否已經初始化，可以在 createI18n 初始化前就引用 i18n, 而不會產生相依問題。

**locale.ts**
```ts
const Eng = {
    welcome: "welcome",
}
let _i18n;
// lazy loading
const i18n = lazyHolder<Locale<typeof Eng>>(()=>{
    return _i18n ??= createI18n();
});

// 當物件取用後(存取相關屬性，以下例而言是 property t)，才袑始化
i18n.t("welcome");
```

**app_store.ts**
```ts
class AppStore{
    constructor(private i18n);
    get currentLanguage(): string{
        return this.i18n.locale.value;
    }
}
const appStore = new AppStore(i18n);
```


## CallableDelegate - lazy loading for functions
```ts
export class CallableDelegate<CALLABLE extends Function> extends Function {
  constructor(
    public delegate: CALLABLE
  );
}
```
### 以實作 vue watch method 為例
```ts
// 這裡只宣告 watchMethod 的介面，及空的 instance，內容還沒有注入
// 因此會報錯 "watch method used before initialized"
let watchMethod=new CallableDelegate(()=>{
    throw new Error("watch method used before setup");
});
// 可以在程式中任意引用 watch 變數，即便 watchMethod 還沒初始化 
export const watch = watchMethod;

// 提供方法 初始化 watchMethod
function setupWatch(watchConstructor: any){
    watchMethod.delegate = watchConstructor;
}
```

