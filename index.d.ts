// Type definitions for billbee-node-api
// Project: https://github.com/zenfulfillment/billbee-node-api
// Definitions by: Zenfulfillment GmbH

/**
 * Creates a new Billbee API client with full TypeScript support
 * @param config Billbee API client configuration
 * @param options Optional client options
 * @returns Billbee API client with type-safe methods
 * 
 * @example
 * // ES module import syntax
 * import BillbeeAPI from 'billbee-node-api';
 * const client = BillbeeAPI({
 *   apiKey: 'your-api-key',
 *   user: 'your-username',
 *   pass: 'your-password'
 * });
 * 
 * @example
 * // Using standard HTTP methods with type inference
 * client.get<ApiPagedResult<Orders.Order>>('/orders', { 
 *   page: 1, 
 *   pageSize: 50 
 * });
 * 
 * @example
 * // Using type-safe request method with Endpoints and Requests
 * client.request({
 *   path: Endpoints.Orders.byId(123),
 *   method: Utils.HttpMethod.GET
 * } as Requests.Orders.GetOrderById);
 */
export default function(
  config: BillbeeClientConfig,
  options?: BillbeeClientOptions
): BillbeeClient;

/**
 * Utility types for working with the Billbee API
 */
export namespace Utils {
  /**
   * Makes all properties of T required (removes undefined but keeps null)
   */
  export type Required<T> = {
    [P in keyof T]-?: T[P];
  };

  /**
   * Makes specified properties of T required
   */
  export type RequiredPick<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

  /**
   * Makes all properties of T optional except for those in K
   */
  export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;

  /**
   * Extracts the parameter types from a URL path function
   * Useful for typing path parameters
   */
  export type PathParams<T extends (...args: any[]) => string> = 
    T extends (...args: infer P) => string ? P : never;

  /**
   * Type-safe HTTP method constants
   */
  export const HttpMethod = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
  } // end namespace Endpoints

  /**
   * HTTP method type
   */
  export type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];
  
  /**
   * Create a type-safe request object for a specific endpoint
   */
  export interface TypedRequest<TPath extends string, TMethod extends HttpMethod, TParams = any, TBody = any, TResponse = any> {
    /** API endpoint path */
    path: TPath;
    /** HTTP method */
    method: TMethod;
    /** Query parameters */
    params?: TParams;
    /** Request body */
    body?: TBody;
    /** Response type */
    _response?: TResponse;
  }
  
  /**
   * Extract the response type from a TypedRequest
   */
  export type ResponseOf<T extends TypedRequest<any, any, any, any, any>> = 
    T extends TypedRequest<any, any, any, any, infer R> ? R : never;
  
  /**
   * Extract the params type from a TypedRequest
   */
  export type ParamsOf<T extends TypedRequest<any, any, any, any, any>> = 
    T extends TypedRequest<any, any, infer P, any, any> ? P : never;
  
  /**
   * Extract the body type from a TypedRequest
   */
  export type BodyOf<T extends TypedRequest<any, any, any, any, any>> = 
    T extends TypedRequest<any, any, any, infer B, any> ? B : never;
}

/**
 * Type-safe request definitions for common API operations
 */
export namespace Requests {
  import e = Endpoints;
  import o = BillbeeAPI.Orders;
  import c = BillbeeAPI.Customers;
  import p = BillbeeAPI.Products;
  import s = BillbeeAPI.Shipments;
  import r = ResponseTypes;
  import t = Utils.TypedRequest;
  import m = Utils.HttpMethod;
  
  export namespace Orders {
    /** Get all orders */
    export type GetOrders = t<typeof e.Orders.BASE, typeof m.GET, o.OrderListParams, never, r.Orders.OrderList>;
    
    /** Get order by ID */
    export type GetOrderById = t<ReturnType<typeof e.Orders.byId>, typeof m.GET, {
      /** The source field for the article title. 0 = Order Position (default), 1 = Article Title, 2 = Article Invoice Text */
      articleTitleSource?: number;
    }, never, r.Orders.Order>;
    
    /** Create new order */
    export type CreateOrder = t<typeof e.Orders.BASE, typeof m.POST, {
      /** Shop ID (deprecated, use ApiAccountId in request body instead) */
      shopId?: number;
    }, o.Order, r.Orders.Order>;
    
    /** Update order tags */
    export type UpdateOrderTags = t<ReturnType<typeof e.Orders.tags>, typeof m.PUT, never, o.OrderTagCreate, any>;
    
    /** Add tags to order */
    export type AddOrderTags = t<ReturnType<typeof e.Orders.tags>, typeof m.POST, never, o.OrderTagCreate, any>;
    
    /** Update order state */
    export type UpdateOrderState = t<ReturnType<typeof e.Orders.orderState>, typeof m.PUT, never, o.OrderStateUpdate, any>;
    
    /** Create invoice for order */
    export type CreateInvoice = t<ReturnType<typeof e.Orders.createInvoice>, typeof m.POST, {
      /** If true, the PDF is included in the response as base64 encoded string */
      includeInvoicePdf?: boolean;
      /** You can pass the id of an invoice template to overwrite the assigned template for invoice creation */
      templateId?: number;
      /** You can pass the id of a connected cloud printer/storage to send the invoice to it */
      sendToCloudId?: number;
    }, never, r.Orders.Invoice>;
  }
  
  export namespace Products {
    /** Get all products */
    export type GetProducts = t<typeof e.Products.BASE, typeof m.GET, {
      /** The current page to request starting with 1 */
      page?: number;
      /** The pagesize for the result list. Values between 1 and 250 are allowed */
      pageSize?: number;
      /** Optional the oldest create date of the articles to be returned */
      minCreatedAt?: string;
      /** Minimum Billbee article ID */
      minimumBillBeeArticleId?: number;
      /** Maximum Billbee article ID */
      maximumBillBeeArticleId?: number;
    }, never, r.Products.ProductList>;
    
    /** Get product by ID */
    export type GetProductById = t<ReturnType<typeof e.Products.byId>, typeof m.GET, {
      /** Either the value id, ean or the value sku to specify the meaning of the id parameter */
      lookupBy?: 'id' | 'sku' | 'ean';
    }, never, r.Products.Product>;
    
    /** Create product */
    export type CreateProduct = t<typeof e.Products.BASE, typeof m.POST, never, p.ArticleApiModel, r.Products.Product>;
    
    /** Update product stock */
    export type UpdateStock = t<typeof e.Products.updateStock, typeof m.POST, never, p.UpdateStockApiModel, r.Products.StockUpdate>;
    
    /** Update multiple stocks */
    export type UpdateStockMultiple = t<typeof e.Products.updateStockMultiple, typeof m.POST, never, p.UpdateStockApiModel[], r.Products.StockUpdate[]>;
    
    /** Get reserved amount */
    export type GetReservedAmount = t<typeof e.Products.reservedAmount, typeof m.GET, {
      /** The id or the sku of the article to query */
      id: string;
      /** Either the value id or the value sku to specify the meaning of the id parameter */
      lookupBy?: 'id' | 'sku';
      /** Optional the stock id if the multi stock feature is enabled */
      stockId?: number;
    }, never, r.Products.ReservedAmount>;
  }
  
  export namespace Customers {
    /** Get all customers */
    export type GetCustomers = t<typeof e.Customers.BASE, typeof m.GET, {
      /** The current page to request starting with 1 */
      page?: number;
      /** The pagesize for the result list. Values between 1 and 250 are allowed */
      pageSize?: number;
    }, never, r.Customers.CustomerList>;
    
    /** Create customer */
    export type CreateCustomer = t<typeof e.Customers.BASE, typeof m.POST, never, c.CreateCustomerApiModel, r.Customers.Customer>;
    
    /** Get customer by ID */
    export type GetCustomerById = t<ReturnType<typeof e.Customers.byId>, typeof m.GET, never, never, r.Customers.Customer>;
    
    /** Update customer */
    export type UpdateCustomer = t<ReturnType<typeof e.Customers.byId>, typeof m.PUT, never, c.CustomerApiModel, r.Customers.Customer>;
    
    /** Get customer addresses */
    export type GetCustomerAddresses = t<ReturnType<typeof e.Customers.addresses>, typeof m.GET, {
      /** The current page to request starting with 1 */
      page?: number;
      /** The pagesize for the result list. Values between 1 and 250 are allowed */
      pageSize?: number;
    }, never, r.Customers.AddressList>;
    
    /** Add address to customer */
    export type AddCustomerAddress = t<ReturnType<typeof e.Customers.addresses>, typeof m.POST, never, c.CustomerAddressApiModel, r.Customers.Address>;
  }
  
  export namespace Shipments {
    /** Create shipment with label */
    export type CreateShipmentWithLabel = t<typeof e.Shipments.shipWithLabel, typeof m.POST, never, s.ShipmentWithLabel, ApiResult<s.ShipmentWithLabelResult>>;
    
    /** Get shipping providers */
    export type GetShippingProviders = t<typeof e.Shipments.providers, typeof m.GET, never, never, any>;
    
    /** Get shipping carriers */
    export type GetShippingCarriers = t<typeof e.Shipments.carriers, typeof m.GET, never, never, any>;
    
    /** Get shipments */
    export type GetShipments = t<typeof e.Shipments.shipments, typeof m.GET, {
      /** Specifies the page to request. */
      page?: number;
      /** Specifies the pagesize. Defaults to 50, max value is 250 */
      pageSize?: number;
      /** Specifies the oldest shipment date to include in the response */
      createdAtMin?: string;
      /** Specifies the newest shipment date to include in the response */
      createdAtMax?: string;
      /** Get shipments for this order only. */
      orderId?: number;
      /** Get Shipments with a shipment greater or equal than this id. New shipments have a greater id than older shipments. */
      minimumShipmentId?: number;
      /** Get Shippings for the specified shipping provider only. */
      shippingProviderId?: number;
    }, never, ApiPagedResult<s.Shipment[]>>;
  }
}

/**
 * Type definitions for error handling
 */
export namespace Errors {
  /**
   * Billbee API error codes
   */
  export enum ErrorCode {
    /** No error */
    NoError = 0,
    /** General error */
    GeneralError = 1,
    /** Validation error */
    ValidationError = 2,
    /** Not found error */
    NotFoundError = 3,
    /** Multiple entries found */
    MultipleEntriesFoundError = 4,
    /** Inactive shop */
    InactiveShopError = 5,
    /** Invalid date format */
    InvalidDateFormat = 6,
    /** Invalid enum value */
    InvalidEnumValue = 7,
    /** Address validation error */
    AddressValidationError = 8,
    /** Missing role */
    MissingRole = 9,
    /** Access denied */
    AccessDenied = 10,
    /** Unauthorized */
    Unauthorized = 11,
    /** Product error */
    ProductError = 12,
    /** Invalid request */
    InvalidRequest = 13,
    /** Duplicate article error */
    DuplicateArticleError = 14,
    /** Server error */
    ServerError = 15,
    /** Not implemented */
    NotImplemented = 16,
    /** Dependent references exist */
    DependentReferencesExist = 17,
    /** Database error */
    DatabaseError = 18,
    /** Article source error */
    ArticleSourceError = 19,
    /** Throttled */
    ThrottledError = 20,
    /** License error */
    LicenseError = 21,
    /** Archived entity error */
    ArchivedEntityError = 22,
    /** Event too old error */
    EventTooOldError = 23,
    /** Multi currency error */
    MultiCurrencyError = 24,
    /** VatId not valid error */
    VatIdNotValidError = 25,
    /** Order readonly error */
    OrderReadonlyError = 26,
    /** Serialnumber error */
    SerialnumberError = 27,
    /** Missing parameter error */
    MissingParameterError = 28,
    /** Import error */
    ImportError = 29
  }

  /**
   * Billbee API error
   */
  export class BillbeeError extends Error {
    /** The error code */
    code: ErrorCode;
    /** The original error response */
    response?: any;

    constructor(message: string, code: ErrorCode, response?: any) {
      super(message);
      this.name = 'BillbeeError';
      this.code = code;
      this.response = response;
    }

    /**
     * Check if the error is of a specific type
     * @param code The error code to check
     */
    is(code: ErrorCode): boolean {
      return this.code === code;
    }

    /**
     * Check if the error is a throttling error
     */
    isThrottled(): boolean {
      return this.is(ErrorCode.ThrottledError);
    }

    /**
     * Check if the error is a not found error
     */
    isNotFound(): boolean {
      return this.is(ErrorCode.NotFoundError);
    }

    /**
     * Check if the error is a validation error
     */
    isValidation(): boolean {
      return this.is(ErrorCode.ValidationError);
    }
  }
}

/**
 * URL path constants for Billbee API endpoints
 * Provides type-safe access to API paths
 */
export namespace Endpoints {
  export const Orders = {
    /** Get all orders or create a new order */
    BASE: '/orders',
    /** Get, update or delete a specific order by ID */
    byId: (id: number | string) => `/orders/${id}`,
    /** Find order by external reference */
    byExtRef: (extRef: string) => `/orders/findbyextref/${extRef}`,
    /** Get or update tags for an order */
    tags: (id: number | string) => `/orders/${id}/tags`,
    /** Change order state */
    orderState: (id: number | string) => `/orders/${id}/orderstate`,
    /** Add shipment to order */
    shipment: (id: number | string) => `/orders/${id}/shipment`,
    /** Get all invoices */
    invoices: '/orders/invoices',
    /** Create delivery note for order */
    createDeliveryNote: (id: number | string) => `/orders/CreateDeliveryNote/${id}`,
    /** Create invoice for order */
    createInvoice: (id: number | string) => `/orders/CreateInvoice/${id}`,
    /** Get patchable fields */
    patchableFields: '/orders/PatchableFields',
    /** Send message to buyer */
    sendMessage: (id: number | string) => `/orders/${id}/send-message`,
    /** Trigger a rule event */
    triggerEvent: (id: number | string) => `/orders/${id}/trigger-event`,
    /** Parse placeholders in text */
    parsePlaceholders: (id: number | string) => `/orders/${id}/parse-placeholders`,
    /** Add message to order */
    message: (id: number | string) => `/orders/${id}/message`
  };

  export const Products = {
    /** Get all products or create a new product */
    BASE: '/products',
    /** Get, update or delete a specific product by ID */
    byId: (id: number | string) => `/products/${id}`,
    /** Get all stock locations */
    stocks: '/products/stocks',
    /** Update stock for a product */
    updateStock: '/products/updatestock',
    /** Update stock for multiple products */
    updateStockMultiple: '/products/updatestockmultiple',
    /** Update stock code */
    updateStockCode: '/products/updatestockcode',
    /** Get reserved amount */
    reservedAmount: '/products/reservedamount',
    /** Get patchable fields */
    patchableFields: '/products/PatchableFields',
    /** Get categories */
    category: '/products/category',
    /** Get or update product custom fields */
    customFields: '/products/custom-fields',
    /** Get specific custom field */
    customFieldById: (id: number | string) => `/products/custom-fields/${id}`,
    /** Get product images */
    images: (productId: number | string) => `/products/${productId}/images`,
    /** Get, update or delete specific image */
    imageById: (productId: number | string, imageId: number | string) => 
      `/products/${productId}/images/${imageId}`,
    /** Get or delete image by ID (without product context) */
    imageOnly: (imageId: number | string) => `/products/images/${imageId}`,
    /** Delete multiple images */
    deleteImages: '/products/images/delete'
  };

  export const Customers = {
    /** Get all customers or create a new customer */
    BASE: '/customers',
    /** Get or update a customer by ID */
    byId: (id: number | string) => `/customers/${id}`,
    /** Get orders from a customer */
    orders: (id: number | string) => `/customers/${id}/orders`,
    /** Get addresses from a customer */
    addresses: (id: number | string) => `/customers/${id}/addresses`,
    /** Get or update specific address */
    address: (id: number | string) => `/customers/addresses/${id}`
  };

  export const CustomerAddresses = {
    /** Get all customer addresses or create a new one */
    BASE: '/customer-addresses',
    /** Get or update a specific address by ID */
    byId: (id: number | string) => `/customer-addresses/${id}`
  };

  export const Shipments = {
    /** Create a new shipment */
    shipment: '/shipment/shipment',
    /** Get shipping providers */
    providers: '/shipment/shippingproviders',
    /** Create a shipment with label */
    shipWithLabel: '/shipment/shipwithlabel',
    /** Get shipping carriers */
    carriers: '/shipment/shippingcarriers',
    /** Get all shipments */
    shipments: '/shipment/shipments'
  };

  export const Webhooks = {
    /** Get, create, or delete webhooks */
    BASE: '/webhooks',
    /** Get, update, or delete a webhook by ID */
    byId: (id: string) => `/webhooks/${id}`,
    /** Get available webhook filters */
    filters: '/webhooks/filters'
  };

  export const Events = {
    /** Get all events */
    BASE: '/events'
  };

  export const Enums = {
    /** Get payment types */
    paymentTypes: '/enums/paymenttypes',
    /** Get shipping carriers */
    shippingCarriers: '/enums/shippingcarriers',
    /** Get account sync states */
    accountSyncState: '/enums/accountsyncstate',
    /** Get shop account types */
    shopAccountType: '/enums/shopaccounttype',
    /** Get shipment types */
    shipmentTypes: '/enums/shipmenttypes',
    /** Get order states */
    orderStates: '/enums/orderstates'
  };

  export const CloudStorage = {
    /** Get all connected cloud storage devices */
    BASE: '/cloudstorages'
  };

  export const ShopAccounts = {
    /** Get all shop accounts */
    BASE: '/shopaccounts'
  };

  export const Layouts = {
    /** Get all layouts */
    BASE: '/layouts'
  };

  export const Search = {
    /** Search for products, customers, and orders */
    BASE: '/search'
  };
}

/**
 * Type-safe helper types for API responses
 */
export namespace ResponseTypes {
  /** Response for a single entity */
  export type Single<T> = ApiResult<T>;
  
  /** Response for a paginated list of entities */
  export type Paged<T> = ApiPagedResult<T>;
  
  /** Order response types */
  export namespace Orders {
    export type Order = Single<BillbeeAPI.Orders.Order>;
    export type OrderList = Paged<BillbeeAPI.Orders.Order>;
    export type Invoice = Single<BillbeeAPI.Orders.Invoice>;
    export type InvoiceList = Paged<BillbeeAPI.Orders.InvoiceApiModel>;
  }
  
  /** Customer response types */
  export namespace Customers {
    export type Customer = Single<BillbeeAPI.Customers.CustomerApiModel>;
    export type CustomerList = Paged<BillbeeAPI.Customers.CustomerApiModel>;
    export type Address = Single<BillbeeAPI.Customers.CustomerAddressApiModel>;
    export type AddressList = Paged<BillbeeAPI.Customers.CustomerAddressApiModel>;
  }
  
  /** Product response types */
  export namespace Products {
    export type Product = Single<BillbeeAPI.Products.ArticleApiModel>;
    export type ProductList = Paged<BillbeeAPI.Products.ArticleApiModel>;
    export type StockUpdate = Single<BillbeeAPI.Products.UpdateStockResponseData>;
    export type StockList = Single<BillbeeAPI.Products.StockResponseData[]>;
    export type ReservedAmount = Single<BillbeeAPI.Products.GetReservedAmountResponseData>;
    export type Image = Single<BillbeeAPI.Products.ArticleImageRelationApiModel>;
    export type ImageList = Single<BillbeeAPI.Products.ArticleImageRelationApiModel[]>;
  }
}

// Re-export all types under a namespace for better organization
export namespace BillbeeAPI {
  export import Orders = Orders;
  export import Customers = Customers;
  export import Products = Products;
  export import Shipments = Shipments;
  export import ShopAccounts = ShopAccounts;
  export import CloudStorage = CloudStorage;
  export import Webhooks = Webhooks;
  export import Events = Events;
  export import Layouts = Layouts;
  export import Search = Search;
  export import Deprecated = Deprecated;
}

declare module 'billbee-node-api' {
  /**
   * Configuration for the Billbee API client
   */
  export interface BillbeeClientConfig {
    /** Billbee API key */
    apiKey: string;
    /** Billbee username or email */
    user: string;
    /** Billbee API password */
    pass: string;
    /** API version (default: 'v1') */
    version?: string;
  }

  /**
   * Options for the Billbee API client
   */
  export interface BillbeeClientOptions {
    /** Whether to automatically stringify big integers (default: true) */
    stringifyBigInt?: boolean;
  }

  /**
   * Base response structure for Billbee API
   */
  export interface ApiResultBase {
    /** Error message if an error occurred */
    ErrorMessage?: string;
    /** Error code if an error occurred */
    ErrorCode?: number;
    /** Description of the error code */
    ErrorDescription?: number;
  }

  /**
   * Generic API result containing data
   */
  export interface ApiResult<T> extends ApiResultBase {
    /** The data returned by the API */
    Data: T;
  }

  /**
   * Pagination information for paginated results
   */
  export interface PagingInformation {
    /** Current page number */
    Page: number;
    /** Total number of pages */
    TotalPages: number;
    /** Total number of rows */
    TotalRows: number;
    /** Number of rows per page */
    PageSize: number;
  }

  /**
   * Generic API result for paginated data
   */
  export interface ApiPagedResult<T> extends ApiResultBase {
    /** Pagination information */
    Paging: PagingInformation;
    /** The data returned by the API */
    Data: T[];
  }

  // Order related types
  export namespace Orders {
    export interface OrderAddressApiModel {
      BillbeeId?: number;
      FirstName?: string;
      LastName?: string;
      Company?: string;
      NameAddition?: string;
      Street?: string;
      HouseNumber?: string;
      Zip?: string;
      City?: string;
      CountryISO2?: string;
      Country?: string;
      Line2?: string;
      Email?: string;
      State?: string;
      Phone?: string;
    }

    export interface ProductImage {
      Url?: string;
      IsDefaultImage?: boolean;
      Position?: number;
      ExternalId?: string;
    }

    export interface SoldProduct {
      OldId?: string;
      Id?: string;
      Title?: string;
      Weight?: number;
      SKU?: string;
      IsDigital?: boolean;
      Images?: ProductImage[];
      EAN?: string;
      PlatformData?: string;
      TARICCode?: string;
      CountryOfOrigin?: string;
      BillbeeId?: number;
      Type?: number;
    }

    export interface OrderItemAttribute {
      Id?: string;
      Name?: string;
      Value?: string;
      Price?: number;
    }

    export interface OrderItem {
      BillbeeId?: number;
      TransactionId?: string;
      Product?: SoldProduct;
      Quantity?: number;
      TotalPrice?: number;
      TaxAmount?: number;
      TaxIndex?: number;
      Discount?: number;
      Attributes?: OrderItemAttribute[];
      GetPriceFromArticleIfAny?: boolean;
      IsCoupon?: boolean;
      ShippingProfileId?: string;
      DontAdjustStock?: boolean;
      UnrebatedTotalPrice?: number;
      SerialNumber?: string;
      InvoiceSKU?: string;
      StockId?: number;
    }

    export interface OrderUser {
      Platform?: string;
      BillbeeShopName?: string;
      BillbeeShopId?: number;
      Id?: string;
      Nick?: string;
      FirstName?: string;
      LastName?: string;
      Email?: string;
    }

    export interface Shipment {
      BillbeeId?: number;
      ShippingId?: string;
      Shipper?: string;
      Created?: string;
      TrackingUrl?: string;
      ShippingProviderId?: number;
      ShippingProviderProductId?: number;
      ShippingCarrier?: number;
      ShipmentType?: number;
    }

    export interface CommentApiModel {
      Id?: number;
      FromCustomer?: boolean;
      Text?: string;
      Name?: string;
      Created?: string;
    }

    export interface MultiLanguageString {
      Text?: string;
      LanguageCode?: string;
    }

    export interface HistoryEntry {
      Created?: string;
      EventTypeName?: string;
      Text?: string;
      EmployeeName?: string;
      TypeId?: number;
    }

    export interface OrderPayment {
      BillbeeId?: number;
      TransactionId?: string;
      PayDate?: string;
      PaymentType?: number;
      SourceTechnology?: string;
      SourceText?: string;
      PayValue?: number;
      Purpose?: string;
      Name?: string;
    }

    export interface ProductService {
      DisplayName?: string;
      DisplayValue?: string;
      RequiresUserInput?: boolean;
      ShowInput?: boolean;
      ServiceName?: string;
      typeName?: string;
      CanBeConfigured?: boolean;
      HasDynamicValues?: boolean;
      IsRequired?: boolean;
    }

    export interface VatDetectionFlags {
      ThirdPartyCountry?: boolean;
      SrcCountryIsEqualToDstCountry?: boolean;
      CustomerHasVatId?: boolean;
      EuDeliveryThresholdExceeded?: boolean;
      OssEnabled?: boolean;
      SellerIsRegisteredInDstCountry?: boolean;
      OrderDistributionCountryIsEmpty?: boolean;
      UserProfileCountryIsEmpty?: boolean;
      SetIglWhenVatIdIsAvailableEnabled?: boolean;
      RatesFrom?: string;
      VatIdFrom?: string;
      IsDistanceSale?: boolean;
    }

    export interface Order {
      RebateDifference?: number;
      ShippingIds?: Shipment[];
      AcceptLossOfReturnRight?: boolean;
      Id?: string;
      OrderNumber?: string;
      State?: number;
      VatMode?: number;
      CreatedAt: string;
      ShippedAt?: string;
      ConfirmedAt?: string;
      PayedAt?: string;
      SellerComment?: string;
      Comments?: CommentApiModel[];
      InvoiceNumberPrefix?: string;
      InvoiceNumberPostfix?: string;
      InvoiceNumber?: number;
      InvoiceDate?: string;
      InvoiceAddress?: OrderAddressApiModel;
      ShippingAddress?: OrderAddressApiModel;
      PaymentMethod?: number;
      ShippingCost?: number;
      TotalCost?: number;
      AdjustmentCost?: number;
      AdjustmentReason?: string;
      OrderItems?: OrderItem[];
      Currency?: string;
      Seller?: OrderUser;
      Buyer?: OrderUser;
      UpdatedAt?: string;
      TaxRate1?: number;
      TaxRate2?: number;
      BillBeeOrderId?: number;
      BillBeeParentOrderId?: number;
      VatId?: string;
      Tags?: string[];
      ShipWeightKg?: number;
      LanguageCode?: string;
      PaidAmount?: number;
      ShippingProfileId?: string;
      ShippingProviderId?: number;
      ShippingProviderProductId?: number;
      ShippingProviderName?: string;
      ShippingProviderProductName?: string;
      ShippingProfileName?: string;
      PaymentInstruction?: string;
      IsCancelationFor?: string;
      PaymentTransactionId?: string;
      DistributionCenter?: string;
      DeliverySourceCountryCode?: string;
      CustomInvoiceNote?: string;
      CustomerNumber?: string;
      PaymentReference?: string;
      ShippingServices?: ProductService[];
      Customer?: Customers.CustomerApiModel;
      History?: HistoryEntry[];
      Payments?: OrderPayment[];
      LastModifiedAt?: string;
      ArchivedAt?: string;
      RestoredAt?: string;
      ApiAccountId?: number;
      ApiAccountName?: string;
      MerchantVatId?: string;
      CustomerVatId?: string;
      IsFromBillbeeApi?: boolean;
      WebUrl?: string;
    }

    export interface OrderStateUpdate {
      /** The new state to set */
      NewStateId: number;
    }

    export interface OrderTagCreate {
      Tags?: string[];
    }

    export interface ApiAddShipmentToOrderModel {
      /** The id of the shipment (Sendungsnummer/trackingid) */
      ShippingId: string;
      /** Optional a differing order number of the shipment if available */
      OrderId?: string;
      /** Optional a text stored with the shipment */
      Comment?: string;
      /** Optional the id of a shipping provider existing in the billbee account that should be assigned to the shipment */
      ShippingProviderId?: number;
      /** Optional the id of a shipping provider product that should be assigend to the shipment */
      ShippingProviderProductId?: number;
      /** Optional the id of a shipping carrier that should be assigend to the shipment */
      CarrierId?: number;
      /** 0 if Shipment, 1 if Retoure */
      ShipmentType?: number;
    }

    export interface OrderListParams {
      /** The oldest order date to include in the response (optional) */
      minOrderDate?: string;
      /** The newest order date to include in the response (optional) */
      maxOrderDate?: string;
      /** The page to request (optional, default: 1) */
      page?: number;
      /** The pagesize. Defaults to 50, max value is 250 (optional) */
      pageSize?: number;
      /** List of shop ids for which invoices should be included (optional) */
      shopId?: number | number[];
      /** List of state ids to include in the response (optional) */
      orderStateId?: number | number[];
      /** List of tags the order must have attached to be included in the response (optional) */
      tag?: string | string[];
      /** If given, all delivered orders have an Id greater than or equal to the given minimumOrderId (optional) */
      minimumBillBeeOrderId?: number;
      /** If given, the last modification has to be newer than the given date (optional) */
      modifiedAtMin?: string;
      /** If given, the last modification has to be older or equal than the given date (optional) */
      modifiedAtMax?: string;
      /** The source field for the article title. 0 = Order Position (default), 1 = Article Title, 2 = Article Invoice Text (optional) */
      articleTitleSource?: number;
      /** If true the list of tags passed to the call are used to filter orders to not include these tags (optional) */
      excludeTags?: boolean;
    }

    export interface InvoiceApiModel {
      InvoiceNumber?: string;
      Type?: string;
      Title?: string;
      Salutation?: string;
      LastName?: string;
      FirstName?: string;
      Company?: string;
      CustomerNumber?: number;
      DebtorNumber?: number;
      InvoiceDate?: string;
      TotalNet?: number;
      Currency?: string;
      TotalGross?: number;
      PaymentTypeId?: number;
      OrderNumber?: string;
      TransactionId?: string;
      Email?: string;
      ShopName?: string;
      PayDate?: string;
      VatMode?: number;
      BillbeeId?: number;
      ShippingCountry?: string;
      MerchantVatId?: string;
      CustomerVatId?: string;
      VatFlags?: VatDetectionFlags;
    }

    export interface Invoice {
      OrderNumber?: string;
      InvoiceNumber?: string;
      PDFData?: string;
      InvoiceDate?: string;
      TotalGross?: number;
      TotalNet?: number;
      PdfDownloadUrl?: string;
    }
  }

  // Customer related types
  export namespace Customers {
    export interface CustomerMetaDataApiModel {
      Id?: number;
      TypeId?: number;
      TypeName?: string;
      SubType?: string;
      Value?: string;
    }

    export interface CustomerApiModel {
      Id?: number;
      Name?: string;
      Email?: string;
      Tel1?: string;
      Tel2?: string;
      Number?: number;
      PriceGroupId?: number;
      LanguageId?: number;
      DefaultMailAddress?: CustomerMetaDataApiModel;
      DefaultCommercialMailAddress?: CustomerMetaDataApiModel;
      DefaultStatusUpdatesMailAddress?: CustomerMetaDataApiModel;
      DefaultPhone1?: CustomerMetaDataApiModel;
      DefaultPhone2?: CustomerMetaDataApiModel;
      DefaultFax?: CustomerMetaDataApiModel;
      VatId?: string;
      Type?: number;
      MetaData?: CustomerMetaDataApiModel[];
      ArchivedAt?: string;
      RestoredAt?: string;
    }

    export interface CustomerAddressApiModel {
      Id?: number;
      AddressType?: number;
      CustomerId?: number;
      Company?: string;
      FirstName?: string;
      LastName?: string;
      Name2?: string;
      Street?: string;
      Housenumber?: string;
      Zip?: string;
      City?: string;
      State?: string;
      CountryCode?: string;
      Email?: string;
      Tel1?: string;
      Tel2?: string;
      Fax?: string;
      AddressAddition?: string;
      ArchivedAt?: string;
      RestoredAt?: string;
    }

    export interface CreateCustomerApiModel extends CustomerApiModel {
      Address?: CustomerAddressApiModel;
    }
  }

  // Product related types
  export namespace Products {
    export interface ArticleCategoryApiModel {
      Name?: string;
      Id?: number;
    }

    export interface ArticleApiCustomFieldDefinitionModel {
      Id?: number;
      Name?: string;
      Configuration?: any;
      Type?: number;
      IsNullable?: boolean;
    }

    export interface ArticleApiCustomFieldValueModel {
      Id?: number;
      DefinitionId?: number;
      Definition?: ArticleApiCustomFieldDefinitionModel;
      ArticleId?: number;
      Value?: any;
    }

    export interface StockArticleApiModel {
      Name?: string;
      StockId?: number;
      StockCurrent?: number;
      StockCurrentIsCalculated?: boolean;
      StockWarning?: number;
      StockCode?: string;
      UnfulfilledAmount?: number;
      StockDesired?: number;
    }

    export interface ArticleSourceApiModel {
      Id?: number;
      Source: string;
      SourceId: string;
      ApiAccountName?: string;
      ApiAccountId?: number;
      ExportFactor?: number;
      StockSyncInactive?: boolean;
      StockSyncMin?: number;
      StockSyncMax?: number;
      UnitsPerItem?: number;
      Custom?: any;
    }

    export interface ArticleImageRelationApiModel {
      Url?: string;
      Id?: number;
      ThumbPathExt?: string;
      ThumbUrl?: string;
      Position?: number;
      IsDefault?: boolean;
      ArticleId?: number;
    }

    export interface BomSubArticleApiModel {
      Amount?: number;
      ArticleId?: number;
      SKU?: string;
    }

    export interface ArticleApiModel {
      InvoiceText?: Orders.MultiLanguageString[];
      Manufacturer?: string;
      Id?: number;
      Title?: Orders.MultiLanguageString[];
      Description?: Orders.MultiLanguageString[];
      ShortDescription?: Orders.MultiLanguageString[];
      BasicAttributes?: Orders.MultiLanguageString[];
      Images?: ArticleImageRelationApiModel[];
      VatIndex: number;
      Price: number;
      CostPrice?: number;
      Vat1Rate: number;
      Vat2Rate: number;
      StockDesired?: number;
      StockCurrent?: number;
      StockWarning?: number;
      SKU?: string;
      EAN?: string;
      Materials?: Orders.MultiLanguageString[];
      Tags?: Orders.MultiLanguageString[];
      Sources?: ArticleSourceApiModel[];
      Weight?: number;
      WeightNet?: number;
      LowStock?: boolean;
      StockCode?: string;
      StockReduceItemsPerSale?: number;
      Stocks?: StockArticleApiModel[];
      Category1?: ArticleCategoryApiModel;
      Category2?: ArticleCategoryApiModel;
      Category3?: ArticleCategoryApiModel;
      Type: number;
      Unit?: number;
      UnitsPerItem?: number;
      SoldAmount?: number;
      SoldSumGross?: number;
      SoldSumNet?: number;
      SoldSumNetLast30Days?: number;
      SoldSumGrossLast30Days?: number;
      SoldAmountLast30Days?: number;
      ShippingProductId?: number;
      IsDigital: boolean;
      IsCustomizable: boolean;
      DeliveryTime?: number;
      Recipient?: number;
      Occasion?: number;
      CountryOfOrigin?: string;
      ExportDescription?: string;
      ExportDescriptionMultiLanguage?: Orders.MultiLanguageString[];
      TaricNumber?: string;
      Condition?: number;
      WidthCm?: number;
      LengthCm?: number;
      HeightCm?: number;
      BillOfMaterial?: BomSubArticleApiModel[];
      CustomFields?: ArticleApiCustomFieldValueModel[];
      IsDeactivated?: boolean;
    }

    export interface StockResponseData {
      Id?: number;
      Name?: string;
      Description?: string;
      IsDefault?: boolean;
    }

    export interface UpdateStockApiModel {
      /** The ID of the Billbee product to update (optional) */
      BillbeeId?: number;
      /** The SKU of the product to update */
      Sku: string;
      /** The stock id if the feature multi stock is activated (optional) */
      StockId?: number;
      /** A reason text for the stock update (optional) */
      Reason?: string;
      /** This parameter is currently ignored (optional) */
      OldQuantity?: number;
      /** The new absolute stock quantity for the product you want to set */
      NewQuantity: number;
      /** This parameter is currently ignored (optional) */
      DeltaQuantity?: number;
      /** If true, every sent stockchange is stored and transmitted to the connected shop, even if the value has not changed (optional) */
      ForceSendStockToShops?: boolean;
      /** Automatically reduce the NewQuantity by the currently not fulfilled amount (optional) */
      AutosubtractReservedAmount?: boolean;
    }

    export interface UpdateStockResponseData {
      /** The SKU of the article to update the current stock */
      SKU?: string;
      /** The old value for current stock before the update */
      OldStock?: number;
      /** The new value for current stock after the update */
      CurrentStock?: number;
      /** The value of the unfulfilled amount (reserved) of the article */
      UnfulfilledAmount?: number;
      /** A human readable message that explains the result of the operation */
      Message?: string;
    }

    export interface UpdateStockCodeApiModel {
      BillbeeId?: number;
      Sku?: string;
      StockId?: number;
      StockCode?: string;
    }

    export interface GetReservedAmountResponseData {
      /** The reserve (not fulfilled) qty of the article */
      ReservedAmount?: number;
    }
  }

  // Shipment related types
  export namespace Shipments {
    export interface ShipmentAddressApiModel {
      Company?: string;
      FirstName?: string;
      LastName?: string;
      Name2?: string;
      Street?: string;
      Housenumber?: string;
      Zip?: string;
      City?: string;
      CountryCode?: string;
      CountryCodeISO3?: string;
      Email?: string;
      Telephone?: string;
      AddressAddition?: string;
      IsExportCountry?: boolean;
      State?: string;
    }

    export interface Dimensions {
      length?: number;
      width?: number;
      height?: number;
    }

    export interface CreateShipmentApiModel {
      /** The name of the provider as specified in the billbee account */
      ProviderName: string;
      /** The productcode to be used when creating the shipment. Values depends on the carrier used */
      ProductCode: string;
      /** The name of a connected Cloudprinter to send the label to (optional) */
      PrinterName?: string;
      /** The id of a connected Cloudprinter to send the export docs to (optional) */
      PrinterIdForExportDocs?: number;
      /** A list of services to be used when creating the shipment (optional) */
      Services?: Orders.ProductService[];
      /** The address of the receiver */
      ReceiverAddress: ShipmentAddressApiModel;
      /** Text to be included on the label. Not possible with all carriers (optional) */
      ClientReference?: string;
      /** Not used anymore (optional) */
      CustomerNumber?: string;
      /** The weight in gram of the shipment (optional) */
      WeightInGram?: number;
      /** The value of the shipments content */
      OrderSum: number;
      /** The value of the shipments content (net) */
      TotalNet: number;
      /** The Currency of the ordersum */
      OrderCurrencyCode: string;
      /** Text describing the content of the shipment. Used for export shipments (optional) */
      Content?: string;
      /** Shipdate to be transferred to the carrier (optional) */
      ShipDate?: string;
      /** Shipping carrier ID (optional) */
      shippingCarrier?: number;
      /** Package dimensions (optional) */
      Dimension?: Dimensions;
    }

    export interface ShipmentWithLabel {
      /** The Billbee internal id of the order to ship */
      OrderId: number;
      /** The id of the provider. You can query all providers with the shippingproviders endpoint */
      ProviderId: number;
      /** The id of the shipping provider product to be used */
      ProductId: number;
      /** Parameter to automatically change the orderstate to sent after creating the shipment (optional) */
      ChangeStateToSend?: boolean;
      /** The name of a connected cloudprinter to send the label to (optional) */
      PrinterName?: string;
      /** The shipments weight in gram to override the calculated weight (optional) */
      WeightInGram?: number;
      /** Shipdate to be transmitted to the carrier (optional) */
      ShipDate?: string;
      /** Reference text to be included on the label. Works not with all carriers (optional) */
      ClientReference?: string;
      /** Dimensions of the package in cm (optional) */
      Dimension?: Dimensions;
    }

    export interface ShipmentWithLabelResult {
      OrderId?: number;
      OrderReference?: string;
      ShippingId?: string;
      TrackingUrl?: string;
      LabelDataPdf?: string;
      ExportDocsPdf?: string;
      Carrier?: string;
      ShippingDate?: string;
    }
  }

  // Shop account related types
  export namespace ShopAccounts {
    export interface ShopAccountReadApiModel {
      Id?: number;
      AccountType?: number;
      Name?: string;
      LastSyncDate?: string;
      LastSyncState?: number;
    }
  }

  // Cloud storage related types
  export namespace CloudStorage {
    export interface CloudStorageApiModel {
      Id?: number;
      Name?: string;
      Type?: string;
      UsedAsPrinter?: boolean;
    }
  }

  // Webhook related types
  export namespace Webhooks {
    export interface WebHookApiModel {
      Secret: string;
      Filters?: string[];
      Headers?: Record<string, string>;
      Properties?: Record<string, any>;
      Id?: string;
      WebHookUri: string;
      Description?: string;
      IsPaused?: boolean;
    }
  }

  // Event related types
  export namespace Events {
    export interface EventListParams {
      /** The oldest date to include in the response (optional) */
      minDate?: string;
      /** The newest date to include in the response (optional) */
      maxDate?: string;
      /** The page to request (optional, default: 1) */
      page?: number;
      /** The pagesize. Defaults to 50, max value is 250 (optional) */
      pageSize?: number;
      /** Filter for specific event types (optional) */
      typeId?: number | number[];
      /** Filter for specific order id (optional) */
      orderId?: number;
    }
  }

  // Layout related types
  export namespace Layouts {
    export interface LayoutTemplate {
      Id?: number;
      Name?: string;
      Type?: number;
    }
  }

  // Search related types
  export namespace Search {
    export interface SearchModel {
      Type?: string[];
      Term?: string;
      SearchMode?: number;
    }

    export interface ProductResult {
      Id?: number;
      ShortText?: string;
      SKU?: string;
      Tags?: string;
    }

    export interface OrderResult {
      Id?: number;
      ExternalReference?: string;
      BuyerName?: string;
      InvoiceNumber?: string;
      CustomerName?: string;
      ArticleTexts?: string;
    }

    export interface CustomerResult {
      Id?: number;
      Name?: string;
      Addresses?: string;
      Number?: string;
    }

    export interface SearchResultsModel {
      Products?: ProductResult[];
      Orders?: OrderResult[];
      Customers?: CustomerResult[];
    }
  }
  
  /**
   * Deprecated endpoints and types
   * @deprecated These endpoints and types are marked as deprecated in the Billbee API
   */
  export namespace Deprecated {
    /**
     * Find a single order by its external ID (order number)
     * @deprecated Use other order lookup methods instead
     */
    export interface OrderFindDeprecated {
      /**
       * The order ID from the external system
       */
      id: string;
      /**
       * Optional name of the shop/marketplace the order was imported from
       */
      partner?: string;
    }
    
    /**
     * Ping shipment service
     * @deprecated No replacement method specified
     */
    export interface ShipmentPingDeprecated {
      // No parameters
    }
  }

  /**
   * Billbee API Client
   * This interface provides both the standard HTTP methods and type-safe request methods
   */
  export interface BillbeeClient {
    /**
     * Performs a GET request to the specified endpoint
     * @param url The endpoint URL
     * @param params Optional query parameters
     * @returns Promise containing the API response
     * 
     * @example
     * // Get all orders with pagination
     * client.get<ApiPagedResult<Orders.Order>>('/orders', { 
     *   page: 1, 
     *   pageSize: 50,
     *   minOrderDate: '2023-01-01'
     * });
     * 
     * @example
     * // Get a single order by ID
     * client.get<ApiResult<Orders.Order>>('/orders/123');
     * 
     * @example
     * // Get all products
     * client.get<ApiPagedResult<Products.ArticleApiModel>>('/products', {
     *   page: 1,
     *   pageSize: 50
     * });
     * 
     * @example
     * // Get customer addresses
     * client.get<ApiPagedResult<Customers.CustomerAddressApiModel>>('/customer-addresses');
     * 
     * @deprecated The following endpoints are deprecated according to the Billbee API:
     * - `/api/v1/orders/find/{id}/{partner}`: Use alternative order lookup methods instead
     * - `/api/v1/shipment/ping`: No replacement method specified
     */
    get<T = any>(url: string, params?: Record<string, any>): Promise<T>;
    
    /**
     * Performs a POST request to the specified endpoint
     * @param url The endpoint URL
     * @param data The data to send
     * @returns Promise containing the API response
     * 
     * @example
     * // Create a new order
     * client.post<ApiResult<Orders.Order>>('/orders', {
     *   CreatedAt: new Date().toISOString(),
     *   OrderNumber: 'EXT-12345',
     *   InvoiceAddress: {
     *     FirstName: 'John',
     *     LastName: 'Doe',
     *     Street: 'Main Street',
     *     HouseNumber: '1',
     *     Zip: '12345',
     *     City: 'Sample City',
     *     CountryISO2: 'US'
     *   },
     *   OrderItems: [{
     *     Product: {
     *       SKU: 'PROD-001',
     *       Title: 'Sample Product'
     *     },
     *     Quantity: 1,
     *     TotalPrice: 29.99
     *   }]
     * });
     * 
     * @example
     * // Update product stock
     * client.post<ApiResult<Products.UpdateStockResponseData>>('/products/updatestock', {
     *   Sku: 'ABC123', 
     *   NewQuantity: 100
     * });
     * 
     * @example
     * // Create a shipment
     * client.post<ApiResult<Shipments.ShipmentWithLabelResult>>('/shipment/shipwithlabel', {
     *   OrderId: 123,
     *   ProviderId: 1,
     *   ProductId: 2,
     *   ChangeStateToSend: true
     * });
     */
    post<T = any>(url: string, data: any): Promise<T>;
    
    /**
     * Performs a PUT request to the specified endpoint
     * @param url The endpoint URL
     * @param data The data to send
     * @returns Promise containing the API response
     * 
     * @example
     * // Update order tags
     * client.put<ApiResult<any>>('/orders/123/tags', {
     *   Tags: ['important', 'rush']
     * } as Orders.OrderTagCreate);
     * 
     * @example
     * // Update a customer address
     * client.put<ApiResult<Customers.CustomerAddressApiModel>>('/customer-addresses/123', {
     *   FirstName: 'Jane',
     *   LastName: 'Smith',
     *   Street: 'New Street',
     *   HouseNumber: '42',
     *   Zip: '54321',
     *   City: 'New City',
     *   CountryCode: 'DE'
     * } as Customers.CustomerAddressApiModel);
     * 
     * @example
     * // Add images to a product
     * client.put<ApiResult<Products.ArticleImageRelationApiModel>>('/products/123/images', [
     *   {
     *     Url: 'https://example.com/product-image.jpg',
     *     IsDefault: true
     *   }
     * ], { replace: true });
     */
    put<T = any>(url: string, data?: any): Promise<T>;
    
    /**
     * Performs a PATCH request to the specified endpoint
     * @param url The endpoint URL
     * @param data The data to send
     * @returns Promise containing the API response
     * 
     * @example
     * // Partially update an order
     * client.patch<ApiResult<Orders.Order>>('/orders/123', { 
     *   ShippingCost: 4.99,
     *   Currency: 'EUR'
     * });
     * 
     * @example
     * // Partially update a product
     * client.patch<ApiResult<Products.ArticleApiModel>>('/products/123', { 
     *   StockCurrent: 50,
     *   Price: 29.99
     * });
     * 
     * @example
     * // Partially update a customer address
     * client.patch<ApiResult<Customers.CustomerAddressApiModel>>('/customers/addresses/123', {
     *   Street: 'Updated Street'
     * });
     */
    patch<T = any>(url: string, data?: any): Promise<T>;
    
    /**
     * Performs a DELETE request to the specified endpoint
     * @param url The endpoint URL
     * @returns Promise containing the API response
     * 
     * @example
     * // Delete a product
     * client.del<ApiResult<any>>('/products/123');
     * 
     * @example
     * // Delete a webhook
     * client.del<ApiResult<any>>('/webhooks/my-webhook-id');
     * 
     * @example
     * // Delete a product image
     * client.del<ApiResult<any>>('/products/123/images/456');
     */
    del<T = any>(url: string): Promise<T>;

    /**
     * Make a type-safe request to the Billbee API
     * @param request The typed request definition
     * @returns Promise containing the API response
     * 
     * @example
     * // Get all orders
     * client.request({
     *   path: Endpoints.Orders.BASE,
     *   method: Utils.HttpMethod.GET,
     *   params: { page: 1, pageSize: 50 }
     * } as Requests.Orders.GetOrders);
     * 
     * @example
     * // Create a new order
     * client.request({
     *   path: Endpoints.Orders.BASE,
     *   method: Utils.HttpMethod.POST,
     *   body: orderData
     * } as Requests.Orders.CreateOrder);
     * 
     * @example
     * // Get order by ID with strong typing
     * client.request<Requests.Orders.GetOrderById>({
     *   path: Endpoints.Orders.byId(123),
     *   method: Utils.HttpMethod.GET
     * });
     */
    request<TRequest extends Utils.TypedRequest<any, Utils.HttpMethod, any, any, any>>(
      request: Omit<TRequest, '_response'>
    ): Promise<Utils.ResponseOf<TRequest>>;
  }
}