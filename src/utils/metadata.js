export const testEvents = [
    {
        "name": "singleAssetBalanceUpdates",
        "description": "Get token balance updates as map { account => delta } based on tx params (optionally reduced)",
        "implementations": [
            {
                "michelsonParameterEvent" : {
                    "parameter": {"prim": "or", "args": [
                            {"prim": "pair", "annots": ["%mint"], "args": [{"prim": "address"}, {"prim": "nat"}]},
                            {"prim": "nat", "annots": ["%burn"]}
                        ]},
                    "returnType": {"prim": "map", "args": [{"prim": "address"}, {"prim": "int"}]},
                    "code": [
                        {"prim": "DUP"},
                        {"prim": "CDR"},
                        {"prim": "SWAP"},
                        {"prim": "CAR"},
                        {
                            "prim": "IF_LEFT",
                            "args": [
                                [{"prim": "DUP"}, {"prim": "CDR"}, {"prim": "INT"}, {"prim": "SOME"}, {"prim": "SWAP"}, {"prim": "CAR"}],
                                [{"prim": "INT"}, {"prim": "NEG"}, {"prim": "SOME"}, {"prim": "SENDER"}]
                            ]
                        },
                        {"prim": "UPDATE"},
                        {"prim": "NIL", "args": [{"prim": "operation"}]},
                        {"prim": "PAIR"}
                    ],
                    "entrypoints": ["mint", "burn"]
                }
            },
            {
                "michelsonInitialStorageEvent": {
                    "parameter": {
                        "prim": "map", "annots": ["%ledger"], "args": [{"prim": "pair", "args": [{"prim": "address"}, {"prim": "nat"}]}, {"prim": "nat"}]
                    },
                    "returnType": {
                        "prim": "map", "args": [{"prim": "pair", "args": [{"prim": "address"}, {"prim": "nat"}]}, {"prim": "int"}]
                    },
                    "code": [
                        {"prim": "CAR"},
                        {"prim": "MAP", "args": [[{"prim": "CDR"}, {"prim": "INT"}]]},
                        {"prim": "NIL", "args": [{"prim": "operation"}]}, {"prim": "PAIR"}
                    ]
                }
            },
            {
                "michelsonExtendedStorageEvent" : {
                    "parameter": {
                        "prim": "map", "annots": ["%ledger"], "args": [{"prim": "pair", "args": [{"prim": "address"}, {"prim": "nat"}]}, {"prim": "option", "args": [{"prim": "nat"}]}]
                    },
                    "returnType": {
                        "prim": "map", "args": [{"prim": "pair", "args": [{"prim": "address"}, {"prim": "nat"}]}, {"prim": "int"}]
                    },
                    "code": [
                        {"prim": "CAR"},
                        {"prim": "MAP", "args": [[{"prim": "CDR"}, {"prim": "IF_NONE", "args": [
                                    [{"prim": "PUSH", "args": [{"prim": "int"}, {"int": "0"}]}],
                                    [{"prim": "INT"}]
                                ]}]]},
                        {"prim": "NIL", "args": [{"prim": "operation"}]}, {"prim": "PAIR"}
                    ],
                    "entrypoints": ["mint"]
                }
            },
        ]
    },
    {
        "name": "multiAssetBalanceUpdates",
        "description": "Get token balance updates as map { (account, token_id) => delta } based on tx params (reduced)",
        "implementations": [
            {
                "michelsonParameterEvent": {
                    "parameter": {
                        "prim": "or",
                        "args": [
                            {
                                "prim": "list",
                                "annots": ["%burn_tokens"],
                                "args": [
                                    {
                                        "prim": "pair",
                                        "args": [
                                            {"prim": "address", "annots": ["%owner"]},
                                            {"prim": "pair", "args": [{"prim": "nat", "annots": ["%token_id"]}, {"prim": "nat", "annots": ["%amount"]}]}
                                        ]
                                    }
                                ]
                            },
                            {
                                "prim": "list",
                                "annots": ["%mint_tokens"],
                                "args": [
                                    {
                                        "prim": "pair",
                                        "args": [
                                            {"prim": "address", "annots": ["%owner"]},
                                            {"prim": "pair", "args": [{"prim": "nat", "annots": ["%token_id"]}, {"prim": "nat", "annots": ["%amount"]}]}
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    "returnType": {"prim": "map", "args": [{"prim": "pair", "args": [{"prim": "address"}, {"prim": "nat"}]}, {"prim": "int"}]},
                    "code": [
                        {"prim": "DUP"},
                        {"prim": "CDR"},
                        {"prim": "SWAP"},
                        {"prim": "CAR"},
                        {
                            "prim": "IF_LEFT",
                            "args": [
                                [
                                    {
                                        "prim": "ITER",
                                        "args": [
                                            [
                                                {"prim": "SWAP"},
                                                {"prim": "DUP"},
                                                {"prim": "DIG", "args": [{"int": "2"}]},
                                                {"prim": "DUP"},
                                                {"prim": "DUG", "args": [{"int": "3"}]},
                                                {"prim": "CDR"},
                                                {"prim": "CAR"},
                                                {"prim": "DIG", "args": [{"int": "3"}]},
                                                {"prim": "DUP"},
                                                {"prim": "DUG", "args": [{"int": "4"}]},
                                                {"prim": "CAR"},
                                                {"prim": "PAIR"},
                                                {"prim": "GET"},
                                                {
                                                    "prim": "IF_NONE",
                                                    "args": [
                                                        [
                                                            {"prim": "SWAP"},
                                                            {"prim": "DUP"},
                                                            {"prim": "DUG", "args": [{"int": "2"}]},
                                                            {"prim": "CDR"},
                                                            {"prim": "CDR"},
                                                            {"prim": "INT"},
                                                            {"prim": "NEG"}
                                                        ],
                                                        [
                                                            {"prim": "DIG", "args": [{"int": "2"}]},
                                                            {"prim": "DUP"},
                                                            {"prim": "DUG", "args": [{"int": "3"}]},
                                                            {"prim": "CDR"},
                                                            {"prim": "CDR"},
                                                            {"prim": "INT"},
                                                            {"prim": "SWAP"},
                                                            {"prim": "SUB"}
                                                        ]
                                                    ]
                                                },
                                                {"prim": "SOME"},
                                                {"prim": "DIG", "args": [{"int": "2"}]},
                                                {"prim": "DUP"},
                                                {"prim": "DUG", "args": [{"int": "3"}]},
                                                {"prim": "CDR"},
                                                {"prim": "CAR"},
                                                {"prim": "DIG", "args": [{"int": "3"}]},
                                                {"prim": "CAR"},
                                                {"prim": "PAIR"},
                                                {"prim": "UPDATE"}
                                            ]
                                        ]
                                    }
                                ],
                                [
                                    {
                                        "prim": "ITER",
                                        "args": [
                                            [
                                                {"prim": "SWAP"},
                                                {"prim": "DUP"},
                                                {"prim": "DIG", "args": [{"int": "2"}]},
                                                {"prim": "DUP"},
                                                {"prim": "DUG", "args": [{"int": "3"}]},
                                                {"prim": "CDR"},
                                                {"prim": "CAR"},
                                                {"prim": "DIG", "args": [{"int": "3"}]},
                                                {"prim": "DUP"},
                                                {"prim": "DUG", "args": [{"int": "4"}]},
                                                {"prim": "CAR"},
                                                {"prim": "PAIR"},
                                                {"prim": "GET"},
                                                {
                                                    "prim": "IF_NONE",
                                                    "args": [
                                                        [{"prim": "SWAP"}, {"prim": "DUP"}, {"prim": "DUG", "args": [{"int": "2"}]}, {"prim": "CDR"}, {"prim": "CDR"}, {"prim": "INT"}],
                                                        [
                                                            {"prim": "DIG", "args": [{"int": "2"}]},
                                                            {"prim": "DUP"},
                                                            {"prim": "DUG", "args": [{"int": "3"}]},
                                                            {"prim": "CDR"},
                                                            {"prim": "CDR"},
                                                            {"prim": "INT"},
                                                            {"prim": "ADD"}
                                                        ]
                                                    ]
                                                },
                                                {"prim": "SOME"},
                                                {"prim": "DIG", "args": [{"int": "2"}]},
                                                {"prim": "DUP"},
                                                {"prim": "DUG", "args": [{"int": "3"}]},
                                                {"prim": "CDR"},
                                                {"prim": "CAR"},
                                                {"prim": "DIG", "args": [{"int": "3"}]},
                                                {"prim": "CAR"},
                                                {"prim": "PAIR"},
                                                {"prim": "UPDATE"}
                                            ]
                                        ]
                                    }
                                ]
                            ]
                        },
                        {"prim": "NIL", "args": [{"prim": "operation"}]},
                        {"prim": "PAIR"}
                    ],
                    "entrypoints": ["mint_tokens", "burn_tokens"]
                }
            }
        ]
    }
];
