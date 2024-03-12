export const DBConfig = {
    name: "ZK-Social-Proof-DB",
    version: 1,
    objectStoresMeta: [
        {
            store: "verifications",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "identifier", keypath: "identifier", options: { unique: true } },
                { name: "network", keypath: "network", options: { unique: false } },
                { name: "status", keypath: "status", options: { unique: false } },
            ],
        },
    ],
};