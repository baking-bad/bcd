let errors = {
    "Bad deserialized counter": {
        "title": "Deserialized counter does not match the stored one",
        "descr": "The byte sequence references a multisig counter that does not match the one currently stored in the given multisig contract"
    },
    "Bad_hash": {
        "title": "Bad hash",
        "descr": "Wrong hash given"
    },
    "Context_not_found": {
        "title": "Context not found",
        "descr": "Cannot find context corresponding to hash"
    },
    "InconsistentImportedBlock": {
        "title": "Inconsistent imported block",
        "descr": "The imported block is not the expected one."
    },
    "InconsistentOperationHashes": {
        "title": "Inconsistent operation hashes",
        "descr": "The operations given do not match their hashes."
    },
    "InconsistentTypesTypeError": {
        "title": "Inconsistent types (typechecking error)",
        "descr": "This is the basic type clash error, that appears in several places where the equality of two types have to be proven, it is always accompanied with another error that provides more context."
    },
    "Inconsistent_snapshot_data": {
        "title": "Inconsistent snapshot data",
        "descr": "The data provided by the snapshot is inconsistent"
    },
    "Inconsistent_snapshot_file": {
        "title": "Inconsistent snapshot file",
        "descr": "Error while opening snapshot file"
    },
    "Invalid_snapshot_version": {
        "title": "Invalid snapshot version",
        "descr": "The version of the snapshot to import is not valid"
    },
    "Missing_snapshot_data": {
        "title": "Missing data in imported snapshot",
        "descr": "Mandatory data missing while reaching end of snapshot file."
    },
    "RPC_context.Not_found": {
        "title": "RPC lookup failed",
        "descr": "RPC lookup failed. No RPC exists at the URL or the RPC tried to access non-existent data."
    },
    "Restore_context_failure": {
        "title": "Failed to restore context",
        "descr": "Internal error while restoring the context"
    },
    "SnapshotImportFailure": {
        "title": "Snapshot import failure",
        "descr": "The imported snapshot is malformed."
    },
    "System_read_error": {
        "title": "System read error",
        "descr": "Failed to read file"
    },
    "Validator_process.failed_to_checkout_context": {
        "title": "Fail during checkout context",
        "descr": "The context checkout failed using a given hash"
    },
    "Validator_process.system_error_while_validating": {
        "title": "Failed to validate block because of a system error",
        "descr": "The validator failed because of a system error"
    },
    "Writing_error": {
        "title": "Writing error",
        "descr": "Cannot write in file for context dump"
    },
    "WrongBlockExport": {
        "title": "Wrong block export",
        "descr": "The block to export in the snapshot is not valid."
    },
    "WrongProtocolHash": {
        "title": "Wrong protocol hash",
        "descr": "Wrong protocol hash"
    },
    "WrongReconstructMode": {
        "title": "Wrong reconstruct mode",
        "descr": "Reconstruction of contexts while importing is comptible with full mode snapshots only"
    },
    "WrongSnapshotExport": {
        "title": "Wrong snapshot export",
        "descr": "Snapshot exports is not compatible with the current configuration."
    },
    "actionDeserialisation": {
        "title": "The expression is not a valid multisig action",
        "descr": "When trying to deserialise an action from a sequence of bytes, we got an expression that does not correspond to a known multisig action"
    },
    "badBlockArgument": {
        "title": "Bad Block Argument",
        "descr": "Block argument could not be parsed"
    },
    "badChainArgument": {
        "title": "Bad Chain Argument",
        "descr": "Chain argument could not be parsed"
    },
    "badContractParameter": {
        "title": "Contract supplied an invalid parameter",
        "descr": "Either no parameter was supplied to a contract with a non-unit parameter type, a non-unit parameter was passed to an account, or a parameter was supplied of the wrong type"
    },
    "badDeserializedContract": {
        "title": "The byte sequence is not for the given multisig contract",
        "descr": "When trying to deserialise an action from a sequence of bytes, we got an action for another multisig contract"
    },
    "badEndorsementDelayArg": {
        "title": "Bad -endorsement-delay arg",
        "descr": "invalid duration in -endorsement-delay"
    },
    "badMaxPriorityArg": {
        "title": "Bad -max-priority arg",
        "descr": "invalid priority in -max-priority"
    },
    "badMaxWaitingTimeArg": {
        "title": "Bad -max-waiting-time arg",
        "descr": "invalid duration in -max-waiting-time"
    },
    "badMinimalFeesArg": {
        "title": "Bad -minimal-fees arg",
        "descr": "invalid fee threshold in -fee-threshold"
    },
    "badPreservedLevelsArg": {
        "title": "Bad -preserved-levels arg",
        "descr": "invalid number of levels in -preserved-levels"
    },
    "badProtocolArgument": {
        "title": "Bad Protocol Argument",
        "descr": "Protocol argument could not be parsed"
    },
    "badReturnTypeError": {
        "title": "Bad return (typechecking error)",
        "descr": "Unexpected stack at the end of a lambda or script."
    },
    "badStackItemTypeError": {
        "title": "Bad stack item (typechecking error)",
        "descr": "The type of a stack item is unexpected (this error is always accompanied by a more precise one)."
    },
    "badStackTypeError": {
        "title": "Bad stack (typechecking error)",
        "descr": "The stack has an unexpected length or contents."
    },
    "badTezArg": {
        "title": "Bad Tez Arg",
        "descr": "Invalid ꜩ notation in parameter."
    },
    "baking.insufficient_proof_of_work": {
        "title": "Insufficient block proof-of-work stamp",
        "descr": "The block's proof-of-work stamp is insufficient"
    },
    "baking.invalid_block_signature": {
        "title": "Invalid block signature",
        "descr": "A block was not signed with the expected private key."
    },
    "baking.invalid_fitness_gap": {
        "title": "Invalid fitness gap",
        "descr": "The gap of fitness is out of bounds"
    },
    "baking.invalid_signature": {
        "title": "Invalid block signature",
        "descr": "The block's signature is invalid"
    },
    "baking.timestamp_too_early": {
        "title": "Block forged too early",
        "descr": "The block timestamp is before the first slot for this baker at this level"
    },
    "baking.unexpected_endorsement": {
        "title": "Endorsement from unexpected delegate",
        "descr": "The operation is signed by a delegate without endorsement rights."
    },
    "block.inconsistent_double_baking_evidence": {
        "title": "Inconsistent double baking evidence",
        "descr": "A double-baking evidence is inconsistent (two distinct delegates)"
    },
    "block.inconsistent_double_endorsement_evidence": {
        "title": "Inconsistent double endorsement evidence",
        "descr": "A double-endorsement evidence is inconsistent (two distinct delegates)"
    },
    "block.invalid_commitment": {
        "title": "Invalid commitment in block header",
        "descr": "The block header has invalid commitment."
    },
    "block.invalid_double_baking_evidence": {
        "title": "Invalid double baking evidence",
        "descr": "A double-baking evidence is inconsistent (two distinct level)"
    },
    "block.invalid_double_endorsement_evidence": {
        "title": "Invalid double endorsement evidence",
        "descr": "A double-endorsement evidence is malformed"
    },
    "block.multiple_revelation": {
        "title": "Multiple revelations were included in a manager operation",
        "descr": "A manager operation should not contain more than one revelation"
    },
    "block.outdated_double_baking_evidence": {
        "title": "Outdated double baking evidence",
        "descr": "A double-baking evidence is outdated."
    },
    "block.outdated_double_endorsement_evidence": {
        "title": "Outdated double endorsement evidence",
        "descr": "A double-endorsement evidence is outdated."
    },
    "block.too_early_double_baking_evidence": {
        "title": "Too early double baking evidence",
        "descr": "A double-baking evidence is in the future"
    },
    "block.too_early_double_endorsement_evidence": {
        "title": "Too early double endorsement evidence",
        "descr": "A double-endorsement evidence is in the future"
    },
    "block.unrequired_double_baking_evidence": {
        "title": "Unrequired double baking evidence",
        "descr": "A double-baking evidence is unrequired"
    },
    "block.unrequired_double_endorsement_evidence": {
        "title": "Unrequired double endorsement evidence",
        "descr": "A double-endorsement evidence is unrequired"
    },
    "bytesDeserialisation": {
        "title": "The byte sequence is not a valid multisig action",
        "descr": "When trying to deserialise an action from a sequence of bytes, we got an error"
    },
    "canceled": {
        "title": "Canceled",
        "descr": "A promise was unexpectedly canceled"
    },
    "cannotSerializeError": {
        "title": "Not enough gas to serialize error",
        "descr": "The error was too big to be serialized with the provided gas"
    },
    "cannotSerializeFailure": {
        "title": "Not enough gas to serialize argument of FAILWITH",
        "descr": "Argument of FAILWITH was too big to be serialized with the provided gas"
    },
    "cannotSerializeLog": {
        "title": "Not enough gas to serialize execution trace",
        "descr": "Execution trace with stacks was to big to be serialized with the provided gas"
    },
    "cannotSerializeStorage": {
        "title": "Not enough gas to serialize execution storage",
        "descr": "The returned storage was too big to be serialized with the provided gas"
    },
    "cannot_originate_non_spendable_account": {
        "title": "Cannot originate non spendable account",
        "descr": "An origination was attempted that would create a non spendable, non scripted contract"
    },
    "cannot_originate_spendable_smart_contract": {
        "title": "Cannot originate spendable smart contract",
        "descr": "An origination was attempted that would create a spendable scripted contract"
    },
    "cli.key.invalid_uri": {
        "title": "Invalid key uri",
        "descr": "A key has been provided with an invalid uri."
    },
    "cli.signature_mismatch": {
        "title": "Signature mismatch",
        "descr": "The signer produced an invalid signature"
    },
    "cli.unregistered_key_scheme": {
        "title": "Unregistered key scheme",
        "descr": "A key has been provided with an unregistered scheme (no corresponding plugin)"
    },
    "comparableTypeExpectedTypeError": {
        "title": "Comparable type expected (typechecking error)",
        "descr": "A non comparable type was used in a place where only comparable types are accepted."
    },
    "context.failed_to_decode_parameter": {
        "title": "Failed to decode parameter",
        "descr": "Unexpected JSON object."
    },
    "context.failed_to_parse_parameter": {
        "title": "Failed to parse parameter",
        "descr": "The protocol parameters are not valid JSON."
    },
    "context.storage_error": {
        "title": "Storage error (fatal internal error)",
        "descr": "An error that should never happen unless something has been deleted or corrupted in the database."
    },
    "context_dump.read.bad_hash": {
        "title": "Wrong hash given",
        "descr": ""
    },
    "context_dump.read.bad_read": {
        "title": "Cannot read file",
        "descr": ""
    },
    "context_dump.read.cannot_open": {
        "title": "Cannot open file for context restoring",
        "descr": ""
    },
    "context_dump.read.suspicious": {
        "title": "Suspicious file: data after end",
        "descr": ""
    },
    "context_dump.write.cannot_open": {
        "title": "Cannot open file for context dump",
        "descr": ""
    },
    "context_dump.write.context_not_found": {
        "title": "Cannot find context corresponding to hash",
        "descr": ""
    },
    "context_dump.write.missing_space": {
        "title": "Cannot write in file for context dump",
        "descr": ""
    },
    "contract.balance_too_low": {
        "title": "Balance too low",
        "descr": "An operation tried to spend more tokens than the contract has"
    },
    "contract.cannot_pay_storage_fee": {
        "title": "Cannot pay storage fee",
        "descr": "The storage fee is higher than the contract balance"
    },
    "contract.counter_in_the_future": {
        "title": "Invalid counter (not yet reached) in a manager operation",
        "descr": "An operation assumed a contract counter in the future"
    },
    "contract.counter_in_the_past": {
        "title": "Invalid counter (already used) in a manager operation",
        "descr": "An operation assumed a contract counter in the past"
    },
    "contract.empty_transaction": {
        "title": "Empty transaction",
        "descr": "Forbidden to credit 0ꜩ to a contract without code."
    },
    "contract.failure": {
        "title": "Contract storage failure",
        "descr": "Unexpected contract storage error"
    },
    "contract.invalid_contract_notation": {
        "title": "Invalid contract notation",
        "descr": "A malformed contract notation was given to an RPC or in a script."
    },
    "contract.manager.consume_roll_change": {
        "title": "Consume roll change",
        "descr": "Change is not enough to consume a roll."
    },
    "contract.manager.inconsistent_hash": {
        "title": "Inconsistent public key hash",
        "descr": "A revealed manager public key is inconsistent with the announced hash"
    },
    "contract.manager.inconsistent_public_key": {
        "title": "Inconsistent public key",
        "descr": "A provided manager public key is different with the public key stored in the contract"
    },
    "contract.manager.no_roll_for_delegate": {
        "title": "No roll for delegate",
        "descr": "Delegate has no roll."
    },
    "contract.manager.no_roll_snapshot_for_cycle": {
        "title": "No roll snapshot for cycle",
        "descr": "A snapshot of the rolls distribution does not exist for this cycle."
    },
    "contract.manager.unregistered_delegate": {
        "title": "Unregistered delegate",
        "descr": "A contract cannot be delegated to an unregistered delegate"
    },
    "contract.non_existing_contract": {
        "title": "Non existing contract",
        "descr": "A contract handle is not present in the context (either it never was or it has been destroyed)"
    },
    "contract.previously_revealed_key": {
        "title": "Manager operation already revealed",
        "descr": "One tried to revealed twice a manager public key"
    },
    "contract.undelegatable_contract": {
        "title": "Non delegatable contract",
        "descr": "Tried to delegate an implicit contract or a non delegatable originated contract"
    },
    "contract.unrevealed_key": {
        "title": "Manager operation precedes key revelation",
        "descr": "One tried to apply a manager operation without revealing the manager public key"
    },
    "contract.unspendable_contract": {
        "title": "Unspendable contract",
        "descr": "An operation tried to spend tokens from an unspendable contract"
    },
    "contractHasNoScript": {
        "title": "The given contract is not a multisig contract because it has no script",
        "descr": "A multisig command has referenced a scriptless smart contract instead of a multisig smart contract."
    },
    "contractHasNoStorage": {
        "title": "The given contract is not a multisig contract because it has no storage",
        "descr": "A multisig command has referenced a smart contract without storage instead of a multisig smart contract."
    },
    "contractHasUnexpectedStorage": {
        "title": "The storage of the given contract is not of the shape expected for a multisig contract",
        "descr": "A multisig command has referenced a smart contract whose storage is of a different shape than the expected one."
    },
    "contractWithoutCode": {
        "title": "The given contract has no code",
        "descr": "Attempt to get the code of a contract failed because it has nocode. No scriptless contract should remain."
    },
    "delegate.already_active": {
        "title": "Delegate already active",
        "descr": "Useless delegate reactivation"
    },
    "delegate.balance_too_low_for_deposit": {
        "title": "Balance too low for deposit",
        "descr": "Cannot freeze deposit when the balance is too low"
    },
    "delegate.empty_delegate_account": {
        "title": "Empty delegate account",
        "descr": "Cannot register a delegate when its implicit account is empty"
    },
    "delegate.no_deletion": {
        "title": "Forbidden delegate deletion",
        "descr": "Tried to unregister a delegate"
    },
    "delegate.unchanged": {
        "title": "Unchanged delegated",
        "descr": "Contract already delegated to the given delegate"
    },
    "distributed_db.Operation_hash.fetch_canceled": {
        "title": "Canceled fetch of a Operation_hash",
        "descr": "The fetch of a Operation_hash has been canceled"
    },
    "distributed_db.Operation_hash.fetch_timeout": {
        "title": "Timed out fetch of a Operation_hash",
        "descr": "The fetch of a Operation_hash has timed out"
    },
    "distributed_db.Operation_hash.missing": {
        "title": "Missing Operation_hash",
        "descr": "Some Operation_hash is missing from the distributed db"
    },
    "distributed_db.Protocol_hash.fetch_canceled": {
        "title": "Canceled fetch of a Protocol_hash",
        "descr": "The fetch of a Protocol_hash has been canceled"
    },
    "distributed_db.Protocol_hash.fetch_timeout": {
        "title": "Timed out fetch of a Protocol_hash",
        "descr": "The fetch of a Protocol_hash has timed out"
    },
    "distributed_db.Protocol_hash.missing": {
        "title": "Missing Protocol_hash",
        "descr": "Some Protocol_hash is missing from the distributed db"
    },
    "distributed_db.block_hash.fetch_canceled": {
        "title": "Canceled fetch of a block_hash",
        "descr": "The fetch of a block_hash has been canceled"
    },
    "distributed_db.block_hash.fetch_timeout": {
        "title": "Timed out fetch of a block_hash",
        "descr": "The fetch of a block_hash has timed out"
    },
    "distributed_db.block_hash.missing": {
        "title": "Missing block_hash",
        "descr": "Some block_hash is missing from the distributed db"
    },
    "distributed_db.operation_hashes.fetch_canceled": {
        "title": "Canceled fetch of a operation_hashes",
        "descr": "The fetch of a operation_hashes has been canceled"
    },
    "distributed_db.operation_hashes.fetch_timeout": {
        "title": "Timed out fetch of a operation_hashes",
        "descr": "The fetch of a operation_hashes has timed out"
    },
    "distributed_db.operation_hashes.missing": {
        "title": "Missing operation_hashes",
        "descr": "Some operation_hashes is missing from the distributed db"
    },
    "distributed_db.operations.fetch_canceled": {
        "title": "Canceled fetch of a operations",
        "descr": "The fetch of a operations has been canceled"
    },
    "distributed_db.operations.fetch_timeout": {
        "title": "Timed out fetch of a operations",
        "descr": "The fetch of a operations has timed out"
    },
    "distributed_db.operations.missing": {
        "title": "Missing operations",
        "descr": "Some operations is missing from the distributed db"
    },
    "duplicateMapKeys": {
        "title": "Duplicate map keys",
        "descr": "Map literals cannot contain duplicated keys"
    },
    "duplicateScriptField": {
        "title": "Script has a duplicated field (parse error)",
        "descr": "When parsing script, a field was found more than once"
    },
    "duplicateSetValuesInLiteral": {
        "title": "Sets literals cannot contain duplicate elements",
        "descr": "Set literals cannot contain duplicate elements, but a duplicae was found while parsing."
    },
    "empty_proposal": {
        "title": "Empty proposal",
        "descr": "Proposal lists cannot be empty."
    },
    "failNotInTailPositionTypeError": {
        "title": "FAIL not in tail position (typechecking error)",
        "descr": "There is non trivial garbage code after a FAIL instruction."
    },
    "failure": {
        "title": "Generic error",
        "descr": "Unclassified error"
    },
    "gas_exhausted.block": {
        "title": "Gas quota exceeded for the block",
        "descr": "The sum of gas consumed by all the operations in the block exceeds the hard gas limit per block"
    },
    "gas_exhausted.init_deserialize": {
        "title": "Not enough gas for initial deserialization of script expresions",
        "descr": "Gas limit was not high enough to deserialize the transaction parameters or origination script code or initial storage, making the operation impossible to parse within the provided gas bounds."
    },
    "gas_exhausted.operation": {
        "title": "Gas quota exceeded for the operation",
        "descr": "A script or one of its callee took more time than the operation said it would"
    },
    "gas_limit_too_high": {
        "title": "Gas limit out of protocol hard bounds",
        "descr": "A transaction tried to exceed the hard limit on gas"
    },
    "illFormedTypeTypeError": {
        "title": "Ill formed type (typechecking error)",
        "descr": "The toplevel error thrown when trying to parse a type expression (always followed by more precise errors)."
    },
    "illTypedContractTypeError": {
        "title": "Ill typed contract (typechecking error)",
        "descr": "The toplevel error thrown when trying to typecheck a contract code against given input, output and storage types (always followed by more precise errors)."
    },
    "illTypedDataTypeError": {
        "title": "Ill typed data (typechecking error)",
        "descr": "The toplevel error thrown when trying to typecheck a data expression against a given type (always followed by more precise errors)."
    },
    "implicit.empty_implicit_contract": {
        "title": "Empty implicit contract",
        "descr": "No manager operations are allowed on an empty implicit contract."
    },
    "inconsistentAnnotations": {
        "title": "Annotations inconsistent between branches",
        "descr": "The annotations on two types could not be merged"
    },
    "inconsistentFieldAnnotations": {
        "title": "Annotations for field accesses is inconsistent",
        "descr": "The specified field does not match the field annotation in the type"
    },
    "inconsistentStackLengthsTypeError": {
        "title": "Inconsistent stack lengths (typechecking error)",
        "descr": "A stack was of an unexpected length (this error is always in the context of a located error)."
    },
    "inconsistentTypeAnnotations": {
        "title": "Types contain inconsistent annotations",
        "descr": "The two types contain annotations that do not match"
    },
    "incorrect_number_of_endorsements": {
        "title": "Incorrect number of endorsements",
        "descr": "The number of endorsements must be non-negative and at most the endosers_per_block constant."
    },
    "incorrect_priority": {
        "title": "Incorrect priority",
        "descr": "Block priority must be non-negative."
    },
    "internal-event-activation-error": {
        "title": "Internal Event Sink: Wrong Activation URI",
        "descr": "Activation of an Internal Event SINK with an URI failed"
    },
    "internal_operation_replay": {
        "title": "Internal operation replay",
        "descr": "An internal operation was emitted twice by a script"
    },
    "invalidArityTypeError": {
        "title": "Invalid arity (typechecking error)",
        "descr": "In a script or data expression, a primitive was applied to an unsupported number of arguments."
    },
    "invalidConstantTypeError": {
        "title": "Invalid constant (typechecking error)",
        "descr": "A data expression was invalid for its expected type."
    },
    "invalidContractTypeError": {
        "title": "Invalid contract (typechecking error)",
        "descr": "A script or data expression references a contract that does not exist or assumes a wrong type for an existing contract."
    },
    "invalidExpressionKindTypeError": {
        "title": "Invalid expression kind (typechecking error)",
        "descr": "In a script or data expression, an expression was of the wrong kind (for instance a string where only a primitive applications can appear)."
    },
    "invalidIterBody": {
        "title": "ITER body returned wrong stack type",
        "descr": "The body of an ITER instruction must result in the same stack type as before the ITER."
    },
    "invalidMapBlockFail": {
        "title": "FAIL instruction occurred as body of map block",
        "descr": "FAIL cannot be the only instruction in the body. The propper type of the return list cannot be inferred."
    },
    "invalidMapBody": {
        "title": "Invalid map body",
        "descr": "The body of a map block did not match the expected type"
    },
    "invalidPortArgument": {
        "title": "Bad Port Argument",
        "descr": "Port argument could not be parsed"
    },
    "invalidPrimitiveNameCaseTypeError": {
        "title": "Invalid primitive name case (typechecking error)",
        "descr": "In a script or data expression, a primitive name is neither uppercase, lowercase or capitalized."
    },
    "invalidPrimitiveNameTypeErro": {
        "title": "Invalid primitive name (typechecking error)",
        "descr": "In a script or data expression, a primitive name is unknown or has a wrong case."
    },
    "invalidPrimitiveNamespaceTypeError": {
        "title": "Invalid primitive namespace (typechecking error)",
        "descr": "In a script or data expression, a primitive was of the wrong namespace."
    },
    "invalidPrimitiveTypeError": {
        "title": "Invalid primitive (typechecking error)",
        "descr": "In a script or data expression, a primitive was unknown."
    },
    "invalidSignature": {
        "title": "The following signature did not match a public key in the given multisig contract",
        "descr": "A signature was given for a multisig contract that matched none of the public keys of the contract signers"
    },
    "invalidSyntacticConstantError": {
        "title": "Invalid constant (parse error)",
        "descr": "A compile-time constant was invalid for its expected form."
    },
    "invalidWaitArgument": {
        "title": "Bad Wait Argument",
        "descr": "Wait argument could not be parsed"
    },
    "invalid_arg": {
        "title": "Invalid arg",
        "descr": "Negative multiple of periods are not allowed."
    },
    "invalid_binary_format": {
        "title": "Invalid binary format",
        "descr": "Could not deserialize some piece of data from its binary representation"
    },
    "invalid_fitness": {
        "title": "Invalid fitness",
        "descr": "Fitness representation should be exactly 8 bytes long."
    },
    "invalid_proposal": {
        "title": "Invalid proposal",
        "descr": "Ballot provided for a proposal that is not the current one."
    },
    "invalid_remote_signer": {
        "title": "Unexpected URI fot remote signer",
        "descr": "The provided remote signer is invalid."
    },
    "invalid_remote_signer_argument": {
        "title": "Unexpected URI of remote signer",
        "descr": "The remote signer argument could not be parsed"
    },
    "malformed_period": {
        "title": "Malformed period",
        "descr": "Period is negative."
    },
    "micheline.parse_error.annotation_exceeds_max_length": {
        "title": "Micheline parser error: annotation exceeds max length",
        "descr": "While parsing a piece of Micheline source, an annotation exceeded the maximum length (255)."
    },
    "micheline.parse_error.empty_expression": {
        "title": "Micheline parser error: empty_expression",
        "descr": "Tried to interpret an empty piece or Micheline source as a single expression."
    },
    "micheline.parse_error.extra_token": {
        "title": "Micheline parser error: extra token",
        "descr": "While parsing a piece of Micheline source, an extra semi colon or parenthesis was encountered."
    },
    "micheline.parse_error.invalid_utf8_sequence": {
        "title": "Micheline parser error: invalid UTF-8 sequence",
        "descr": "While parsing a piece of Micheline source, a sequence of bytes that is not valid UTF-8 was encountered."
    },
    "micheline.parse_error.misaligned_node": {
        "title": "Micheline parser error: misaligned node",
        "descr": "While parsing a piece of Micheline source, an expression was not aligned with its siblings of the same mother application or sequence."
    },
    "micheline.parse_error.missing_break_after_number": {
        "title": "Micheline parser error: missing break after number",
        "descr": "While parsing a piece of Micheline source, a number was not visually separated from its follower token, leading to misreadability."
    },
    "micheline.parse_error.odd_lengthed_bytes": {
        "title": "Micheline parser error: odd lengthed bytes",
        "descr": "While parsing a piece of Micheline source, the length of a byte sequence (0x...) was not a multiple of two, leaving a trailing half byte."
    },
    "micheline.parse_error.unclosed_token": {
        "title": "Micheline parser error: unclosed token",
        "descr": "While parsing a piece of Micheline source, a parenthesis or a brace was unclosed."
    },
    "micheline.parse_error.undefined_escape_sequence": {
        "title": "Micheline parser error: undefined escape sequence",
        "descr": "While parsing a piece of Micheline source, an unexpected escape sequence was encountered in a string."
    },
    "micheline.parse_error.unexpected_character": {
        "title": "Micheline parser error: unexpected character",
        "descr": "While parsing a piece of Micheline source, an unexpected character was encountered."
    },
    "micheline.parse_error.unexpected_token": {
        "title": "Micheline parser error: unexpected token",
        "descr": "While parsing a piece of Micheline source, an unexpected token was encountered."
    },
    "micheline.parse_error.unterminated_comment": {
        "title": "Micheline parser error: unterminated comment",
        "descr": "While parsing a piece of Micheline source, a commentX was not terminated."
    },
    "micheline.parse_error.unterminated_integer": {
        "title": "Micheline parser error: unterminated integer",
        "descr": "While parsing a piece of Micheline source, an integer was not terminated."
    },
    "micheline.parse_error.unterminated_string": {
        "title": "Micheline parser error: unterminated string",
        "descr": "While parsing a piece of Micheline source, a string was not terminated."
    },
    "michelson.macros.bas_arity": {
        "title": "Wrong number of arguments to macro",
        "descr": "A wrong number of arguments was provided to a macro"
    },
    "michelson.macros.sequence_expected": {
        "title": "Macro expects a sequence",
        "descr": "An macro expects a sequence, but a sequence was not provided"
    },
    "michelson.macros.unexpected_annotation": {
        "title": "Unexpected annotation",
        "descr": "A macro had an annotation, but no annotation was permitted on this macro."
    },
    "michelson_v1.bad_contract_parameter": {
        "title": "Contract supplied an invalid parameter",
        "descr": "Either no parameter was supplied to a contract with a non-unit parameter type, a non-unit parameter was passed to an account, or a parameter was supplied of the wrong type"
    },
    "michelson_v1.bad_return": {
        "title": "Bad return",
        "descr": "Unexpected stack at the end of a lambda or script."
    },
    "michelson_v1.bad_stack": {
        "title": "Bad stack",
        "descr": "The stack has an unexpected length or contents."
    },
    "michelson_v1.bad_stack_item": {
        "title": "Bad stack item",
        "descr": "The type of a stack item is unexpected (this error is always accompanied by a more precise one)."
    },
    "michelson_v1.cannot_serialize_error": {
        "title": "Not enough gas to serialize error",
        "descr": "The error was too big to be serialized with the provided gas"
    },
    "michelson_v1.cannot_serialize_failure": {
        "title": "Not enough gas to serialize argument of FAILWITH",
        "descr": "Argument of FAILWITH was too big to be serialized with the provided gas"
    },
    "michelson_v1.cannot_serialize_log": {
        "title": "Not enough gas to serialize execution trace",
        "descr": "Execution trace with stacks was to big to be serialized with the provided gas"
    },
    "michelson_v1.cannot_serialize_storage": {
        "title": "Not enough gas to serialize execution storage",
        "descr": "The returned storage was too big to be serialized with the provided gas"
    },
    "michelson_v1.comparable_type_expected": {
        "title": "Comparable type expected",
        "descr": "A non comparable type was used in a place where only comparable types are accepted."
    },
    "michelson_v1.deprecated_instruction": {
        "title": "Script is using a deprecated instruction",
        "descr": "A deprecated instruction usage is disallowed in newly created contracts"
    },
    "michelson_v1.duplicate_entrypoint": {
        "title": "Duplicate entrypoint (type error)",
        "descr": "Two entrypoints have the same name."
    },
    "michelson_v1.duplicate_map_keys": {
        "title": "Duplicate map keys",
        "descr": "Map literals cannot contain duplicated keys"
    },
    "michelson_v1.duplicate_script_field": {
        "title": "Script has a duplicated field (parse error)",
        "descr": "When parsing script, a field was found more than once"
    },
    "michelson_v1.duplicate_set_values_in_literal": {
        "title": "Sets literals cannot contain duplicate elements",
        "descr": "Set literals cannot contain duplicate elements, but a duplicae was found while parsing."
    },
    "michelson_v1.entrypoint_name_too_long": {
        "title": "Entrypoint name too long (type error)",
        "descr": "An entrypoint name exceeds the maximum length of 31 characters."
    },
    "michelson_v1.fail_not_in_tail_position": {
        "title": "FAIL not in tail position",
        "descr": "There is non trivial garbage code after a FAIL instruction."
    },
    "michelson_v1.ill_formed_type": {
        "title": "Ill formed type",
        "descr": "The toplevel error thrown when trying to parse a type expression (always followed by more precise errors)."
    },
    "michelson_v1.ill_typed_contract": {
        "title": "Ill typed contract",
        "descr": "The toplevel error thrown when trying to typecheck a contract code against given input, output and storage types (always followed by more precise errors)."
    },
    "michelson_v1.ill_typed_data": {
        "title": "Ill typed data",
        "descr": "The toplevel error thrown when trying to typecheck a data expression against a given type (always followed by more precise errors)."
    },
    "michelson_v1.inconsistent_annotations": {
        "title": "Annotations inconsistent between branches",
        "descr": "The annotations on two types could not be merged"
    },
    "michelson_v1.inconsistent_field_annotations": {
        "title": "Annotations for field accesses is inconsistent",
        "descr": "The specified field does not match the field annotation in the type"
    },
    "michelson_v1.inconsistent_stack_lengths": {
        "title": "Inconsistent stack lengths",
        "descr": "A stack was of an unexpected length (this error is always in the context of a located error)."
    },
    "michelson_v1.inconsistent_type_annotations": {
        "title": "Types contain inconsistent annotations",
        "descr": "The two types contain annotations that do not match"
    },
    "michelson_v1.inconsistent_types": {
        "title": "Inconsistent types",
        "descr": "This is the basic type clash error, that appears in several places where the equality of two types have to be proven, it is always accompanied with another error that provides more context."
    },
    "michelson_v1.invalid_arity": {
        "title": "Invalid arity",
        "descr": "In a script or data expression, a primitive was applied to an unsupported number of arguments."
    },
    "michelson_v1.invalid_big_map": {
        "title": "Invalid big_map",
        "descr": "A script or data expression references a big_map that does not exist or assumes a wrong type for an existing big_map."
    },
    "michelson_v1.invalid_constant": {
        "title": "Invalid constant",
        "descr": "A data expression was invalid for its expected type."
    },
    "michelson_v1.invalid_contract": {
        "title": "Invalid contract",
        "descr": "A script or data expression references a contract that does not exist or assumes a wrong type for an existing contract."
    },
    "michelson_v1.invalid_expression_kind": {
        "title": "Invalid expression kind",
        "descr": "In a script or data expression, an expression was of the wrong kind (for instance a string where only a primitive applications can appear)."
    },
    "michelson_v1.invalid_iter_body": {
        "title": "ITER body returned wrong stack type",
        "descr": "The body of an ITER instruction must result in the same stack type as before the ITER."
    },
    "michelson_v1.invalid_map_block_fail": {
        "title": "FAIL instruction occurred as body of map block",
        "descr": "FAIL cannot be the only instruction in the body. The propper type of the return list cannot be inferred."
    },
    "michelson_v1.invalid_map_body": {
        "title": "Invalid map body",
        "descr": "The body of a map block did not match the expected type"
    },
    "michelson_v1.invalid_primitive": {
        "title": "Invalid primitive",
        "descr": "In a script or data expression, a primitive was unknown."
    },
    "michelson_v1.invalid_primitive_name": {
        "title": "Invalid primitive name",
        "descr": "In a script or data expression, a primitive name is unknown or has a wrong case."
    },
    "michelson_v1.invalid_primitive_name_case": {
        "title": "Invalid primitive name case",
        "descr": "In a script or data expression, a primitive name is neither uppercase, lowercase or capitalized."
    },
    "michelson_v1.invalid_primitive_namespace": {
        "title": "Invalid primitive namespace",
        "descr": "In a script or data expression, a primitive was of the wrong namespace."
    },
    "michelson_v1.missing_script_field": {
        "title": "Script is missing a field (parse error)",
        "descr": "When parsing script, a field was expected, but not provided"
    },
    "michelson_v1.no_such_entrypoint": {
        "title": "No such entrypoint (type error)",
        "descr": "An entrypoint was not found when calling a contract."
    },
    "michelson_v1.runtime_error": {
        "title": "Script runtime error",
        "descr": "Toplevel error for all runtime script errors"
    },
    "michelson_v1.script_overflow": {
        "title": "Script failed (overflow error)",
        "descr": "A FAIL instruction was reached due to the detection of an overflow"
    },
    "michelson_v1.script_rejected": {
        "title": "Script failed",
        "descr": "A FAILWITH instruction was reached"
    },
    "michelson_v1.self_in_lambda": {
        "title": "SELF instruction in lambda",
        "descr": "A SELF instruction was encountered in a lambda expression."
    },
    "michelson_v1.type_too_large": {
        "title": "Stack item type too large",
        "descr": "An instruction generated a type larger than the limit."
    },
    "michelson_v1.undefined_binop": {
        "title": "Undefined binop",
        "descr": "A binary operation is called on operands of types over which it is not defined."
    },
    "michelson_v1.undefined_unop": {
        "title": "Undefined unop",
        "descr": "A unary operation is called on an operand of type over which it is not defined."
    },
    "michelson_v1.unexpected_annotation": {
        "title": "An annotation was encountered where no annotation is expected",
        "descr": "A node in the syntax tree was impropperly annotated"
    },
    "michelson_v1.unexpected_bigmap": {
        "title": "Big map in unauthorized position (type error)",
        "descr": "When parsing script, a big_map type was found in a position where it could end up stored inside a big_map, which is forbidden for now."
    },
    "michelson_v1.unexpected_contract": {
        "title": "Contract in unauthorized position (type error)",
        "descr": "When parsing script, a contract type was found in the storage or parameter field."
    },
    "michelson_v1.unexpected_operation": {
        "title": "Operation in unauthorized position (type error)",
        "descr": "When parsing script, an operation type was found in the storage or parameter field."
    },
    "michelson_v1.ungrouped_annotations": {
        "title": "Annotations of the same kind were found spread apart",
        "descr": "Annotations of the same kind must be grouped"
    },
    "michelson_v1.unknown_primitive_name": {
        "title": "Unknown primitive name",
        "descr": "In a script or data expression, a primitive was unknown."
    },
    "michelson_v1.unmatched_branches": {
        "title": "Unmatched branches",
        "descr": "At the join point at the end of two code branches the stacks have inconsistent lengths or contents."
    },
    "michelson_v1.unordered_map_literal": {
        "title": "Invalid map key order",
        "descr": "Map keys must be in strictly increasing order"
    },
    "michelson_v1.unordered_set_literal": {
        "title": "Invalid set value order",
        "descr": "Set values must be in strictly increasing order"
    },
    "michelson_v1.unreachable_entrypoint": {
        "title": "Unreachable entrypoint (type error)",
        "descr": "An entrypoint in the contract is not reachable."
    },
    "missingScriptField": {
        "title": "Script is missing a field (parse error)",
        "descr": "When parsing script, a field was expected, but not provided"
    },
    "node.bootstrap_pipeline.invalid_locator": {
        "title": "Invalid block locator",
        "descr": "Block locator is invalid."
    },
    "node.bootstrap_pipeline.too_short_locator": {
        "title": "Too short locator",
        "descr": "Block locator is too short."
    },
    "node.p2p_io_scheduler.connection_closed": {
        "title": "Connection closed",
        "descr": "IO error: connection with a peer is closed."
    },
    "node.p2p_pool.connected": {
        "title": "Connected",
        "descr": "Fail to connect with a peer: a connection is already established."
    },
    "node.p2p_pool.connection_refused": {
        "title": "Connection refused",
        "descr": "Connection was refused."
    },
    "node.p2p_pool.peer_banned": {
        "title": "Peer Banned",
        "descr": "The peer identity you tried to connect is banned."
    },
    "node.p2p_pool.pending_connection": {
        "title": "Pending connection",
        "descr": "Fail to connect with a peer: a connection is already pending."
    },
    "node.p2p_pool.point_banned": {
        "title": "Point Banned",
        "descr": "The address you tried to connect is banned."
    },
    "node.p2p_pool.private_mode": {
        "title": "Private mode",
        "descr": "Node is in private mode."
    },
    "node.p2p_pool.rejected": {
        "title": "Rejected peer",
        "descr": "Connection to peer was rejected."
    },
    "node.p2p_pool.too_many_connections": {
        "title": "Too many connections",
        "descr": "Too many connections."
    },
    "node.p2p_socket.decipher_error": {
        "title": "Decipher error",
        "descr": "An error occurred while deciphering."
    },
    "node.p2p_socket.decoding_error": {
        "title": "Decoding error",
        "descr": "An error occurred while decoding."
    },
    "node.p2p_socket.encoding_error": {
        "title": "Encoding error",
        "descr": "An error occurred while encoding."
    },
    "node.p2p_socket.invalid_auth": {
        "title": "Invalid authentication",
        "descr": "Rejected peer connection: invalid authentication."
    },
    "node.p2p_socket.invalid_chunks_size": {
        "title": "Invalid chunks size",
        "descr": "Size of chunks is not valid."
    },
    "node.p2p_socket.invalid_message_size": {
        "title": "Invalid message size",
        "descr": "The size of the message to be written is invalid."
    },
    "node.p2p_socket.myself": {
        "title": "Myself",
        "descr": "Remote peer is actually yourself."
    },
    "node.p2p_socket.not_enough_proof_of_work": {
        "title": "Not enough proof of work",
        "descr": "Remote peer cannot be authenticated: not enough proof of work."
    },
    "node.p2p_socket.rejected_no_common_protocol": {
        "title": "Rejected socket connection - no common network protocol",
        "descr": "Rejected peer connection: rejected socket connection as we have no common network protocol with the peer."
    },
    "node.p2p_socket.rejected_socket_connection": {
        "title": "Rejected socket connection",
        "descr": "Rejected peer connection: rejected socket connection."
    },
    "node.peer_validator.known_invalid": {
        "title": "Known invalid",
        "descr": "Known invalid block found in the peer's chain"
    },
    "node.peer_validator.unknown_ancestor": {
        "title": "Unknown ancestor",
        "descr": "Unknown ancestor block found in the peer's chain"
    },
    "node.prevalidation.future_block_header": {
        "title": "Future block header",
        "descr": "The block was annotated with a time too far in the future."
    },
    "node.prevalidation.oversized_operation": {
        "title": "Oversized operation",
        "descr": "The operation size is bigger than allowed."
    },
    "node.prevalidation.parse_error": {
        "title": "Parsing error in prevalidation",
        "descr": "Raised when an operation has not been parsed correctly during prevalidation."
    },
    "node.prevalidation.too_many_operations": {
        "title": "Too many pending operations in prevalidation",
        "descr": "The prevalidation context is full."
    },
    "node.protocol_validator.invalid_protocol": {
        "title": "Invalid protocol",
        "descr": "Invalid protocol."
    },
    "node.state.bad_data_dir": {
        "title": "Bad data directory",
        "descr": "The data directory could not be read. This could be because it was generated with an old version of the tezos-node program. Deleting and regenerating this directory may fix the problem."
    },
    "node.state.block.inconsistent_context_hash": {
        "title": "Inconsistent commit hash",
        "descr": "When commiting the context of a block, the announced context hash was not the one computed at commit time."
    },
    "node.state.block_not_invalid": {
        "title": "Block not invalid",
        "descr": "The invalid block to be unmarked was not actually invalid."
    },
    "node.state.unknown_chain": {
        "title": "Unknown chain",
        "descr": "The chain identifier could not be found in the chain identifiers table."
    },
    "node.validator.checkpoint_error": {
        "title": "Block incompatible with the current checkpoint.",
        "descr": "The block belongs to a branch that is not compatible with the current checkpoint."
    },
    "node.validator.inactive_chain": {
        "title": "Inactive chain",
        "descr": "Attempted validation of a block from an inactive chain."
    },
    "node_config_file.incorrect_history_mode_switch": {
        "title": "Incorrect history mode switch",
        "descr": "Incorrect history mode switch."
    },
    "nonPositiveThreshold": {
        "title": "Given threshold is not positive",
        "descr": "A multisig threshold should be a positive number"
    },
    "nonce.previously_revealed": {
        "title": "Previously revealed nonce",
        "descr": "Duplicated revelation for a nonce."
    },
    "nonce.too_early_revelation": {
        "title": "Too early nonce revelation",
        "descr": "Nonce revelation happens before cycle end"
    },
    "nonce.too_late_revelation": {
        "title": "Too late nonce revelation",
        "descr": "Nonce revelation happens too late"
    },
    "nonce.unexpected": {
        "title": "Unexpected nonce",
        "descr": "The provided nonce is inconsistent with the committed nonce hash."
    },
    "notASupportedMultisigContract": {
        "title": "The given contract is not one of the supported contracts",
        "descr": "A multisig command has referenced a smart contract whose script is not one of the known multisig contract scripts."
    },
    "notEnoughSignatures": {
        "title": "Not enough signatures were provided for this multisig action",
        "descr": "To run an action on a multisig contract, you should provide at least as many signatures as indicated by the threshold stored in the multisig contract."
    },
    "operation.cannot_parse": {
        "title": "Cannot parse operation",
        "descr": "The operation is ill-formed or for another protocol version"
    },
    "operation.duplicate_endorsement": {
        "title": "Duplicate endorsement",
        "descr": "Two endorsements received from same delegate"
    },
    "operation.invalid_activation": {
        "title": "Invalid activation",
        "descr": "The given key and secret do not correspond to any existing preallocated contract"
    },
    "operation.invalid_endorsement_level": {
        "title": "Unexpected level in endorsement",
        "descr": "The level of an endorsement is inconsistent with the provided block hash."
    },
    "operation.invalid_signature": {
        "title": "Invalid operation signature",
        "descr": "The operation signature is ill-formed or has been made with the wrong public key"
    },
    "operation.missing_signature": {
        "title": "Missing operation signature",
        "descr": "The operation is of a kind that must be signed, but the signature is missing"
    },
    "operation.not_enought_endorsements_for_priority": {
        "title": "Not enough endorsements for priority",
        "descr": "The block being validated does not include the required minimum number of endorsements for this priority."
    },
    "operation.wrong_endorsement_predecessor": {
        "title": "Wrong endorsement predecessor",
        "descr": "Trying to include an endorsement in a block that is not the successor of the endorsed one"
    },
    "operation.wrong_voting_period": {
        "title": "Wrong voting period",
        "descr": "Trying to onclude a proposal or ballot meant for another voting period"
    },
    "raw_context.invalid_depth": {
        "title": "Invalid depth argument",
        "descr": "The raw context extraction depth argument must be positive."
    },
    "raw_store.unknown": {
        "title": "Missing key in store",
        "descr": "Missing key in store"
    },
    "rpc_client.request_failed": {
        "title": "<Untitled>",
        "descr": ""
    },
    "scriptOverflowRuntimeError": {
        "title": "Script failed (overflow error)",
        "descr": "A FAIL instruction was reached due to the detection of an overflow"
    },
    "scriptRejectedRuntimeError": {
        "title": "Script failed (runtime script error)",
        "descr": "A FAILWITH instruction was reached"
    },
    "scriptRuntimeError": {
        "title": "Script runtime error",
        "descr": "Toplevel error for all runtime script errors"
    },
    "seed.unknown_seed": {
        "title": "Unknown seed",
        "descr": "The requested seed is not available"
    },
    "selfInLambda": {
        "title": "SELF instruction in lambda (typechecking error)",
        "descr": "A SELF instruction was encountered in a lambda expression."
    },
    "signer.decoding_error": {
        "title": "Decoding_error",
        "descr": "Error while decoding a remote signer message"
    },
    "signer.encoding_error": {
        "title": "Encoding_error",
        "descr": "Error while encoding a remote signer message"
    },
    "signer.ledger": {
        "title": "Ledger error",
        "descr": "Error when communication to a Ledger Nano S device"
    },
    "signer.ledger.deterministic_nonce_not_implemented": {
        "title": "Ledger deterministic_nonce(_hash) not implemented",
        "descr": "The deterministic_nonce(_hash) functionality is not implemented by the ledger"
    },
    "state.block.contents_not_found": {
        "title": "Block_contents_not_found",
        "descr": "Block not found"
    },
    "state.block.not_found": {
        "title": "Block_not_found",
        "descr": "Block not found"
    },
    "storage_exhausted.operation": {
        "title": "Storage quota exceeded for the operation",
        "descr": "A script or one of its callee wrote more bytes than the operation said it would"
    },
    "storage_limit_too_high": {
        "title": "Storage limit out of protocol hard bounds",
        "descr": "A transaction tried to exceed the hard limit on storage"
    },
    "tez.addition_overflow": {
        "title": "Overflowing tez addition",
        "descr": "An addition of two tez amounts overflowed"
    },
    "tez.invalid_divisor": {
        "title": "Invalid tez divisor",
        "descr": "Multiplication of a tez amount by a non positive integer"
    },
    "tez.multiplication_overflow": {
        "title": "Overflowing tez multiplication",
        "descr": "A multiplication of a tez amount by an integer overflowed"
    },
    "tez.negative_multiplicator": {
        "title": "Negative tez multiplicator",
        "descr": "Multiplication of a tez amount by a negative integer"
    },
    "tez.subtraction_underflow": {
        "title": "Underflowing tez subtraction",
        "descr": "An subtraction of two tez amounts underflowed"
    },
    "thresholdTooHigh": {
        "title": "Given threshold is too high",
        "descr": "The given threshold is higher than the number of keys, this would lead to a frozen multisig contract"
    },
    "timestamp_add": {
        "title": "Timestamp add",
        "descr": "Overflow when adding timestamps."
    },
    "timestamp_sub": {
        "title": "Timestamp sub",
        "descr": "Substracting timestamps resulted in negative period."
    },
    "too_many_internal_operations": {
        "title": "Too many internal operations",
        "descr": "A transaction exceeded the hard limit of internal operations it can emit"
    },
    "too_many_proposals": {
        "title": "Too many proposals",
        "descr": "The delegate reached the maximum number of allowed proposals."
    },
    "typeTooLarge": {
        "title": "Stack item type too large",
        "descr": "An instruction generated a type larger than the limit."
    },
    "unauthorized_ballot": {
        "title": "Unauthorized ballot",
        "descr": "The delegate provided for the ballot is not in the voting listings."
    },
    "unauthorized_proposal": {
        "title": "Unauthorized proposal",
        "descr": "The delegate provided for the proposal is not in the voting listings."
    },
    "undefinedBinopTypeError": {
        "title": "Undefined binop (typechecking error)",
        "descr": "A binary operation is called on operands of types over which it is not defined."
    },
    "undefinedUnopTypeError": {
        "title": "Undefined unop (typechecking error)",
        "descr": "A unary operation is called on an operand of type over which it is not defined."
    },
    "undefined_operation_nonce": {
        "title": "Ill timed access to the origination nonce",
        "descr": "An origination was attemped out of the scope of a manager operation"
    },
    "unexpectedAnnotation": {
        "title": "An annotation was encountered where no annotation is expected",
        "descr": "A node in the syntax tree was impropperly annotated"
    },
    "unexpectedBigMap": {
        "title": "Big map in unauthorized position (type error)",
        "descr": "When parsing script, a big_map type was found somewhere else than in the left component of the toplevel storage pair."
    },
    "unexpectedOperation": {
        "title": "Big map in unauthorized position (type error)",
        "descr": "When parsing script, a operation type was found in the storage or parameter field."
    },
    "unexpected_ballot": {
        "title": "Unexpected ballot",
        "descr": "Ballot recorded outside of a voting period."
    },
    "unexpected_level": {
        "title": "Unexpected level",
        "descr": "Level must be non-negative."
    },
    "unexpected_nonce_length": {
        "title": "Unexpected nonce length",
        "descr": "Nonce length is incorrect."
    },
    "unexpected_proposal": {
        "title": "Unexpected proposal",
        "descr": "Proposal recorded outside of a proposal period."
    },
    "ungroupedAnnotations": {
        "title": "Annotations of the same kind were found spread apart",
        "descr": "Annotations of the same kind must be grouped"
    },
    "unix.system_info": {
        "title": "Unix System_info failure",
        "descr": "Unix System_info failure"
    },
    "unix_error": {
        "title": "Unix error",
        "descr": "An unhandled unix exception"
    },
    "unknownPrimitiveNameTypeError": {
        "title": "Unknown primitive name (typechecking error)",
        "descr": "In a script or data expression, a primitive was unknown."
    },
    "unmatchedBranchesTypeError": {
        "title": "Unmatched branches (typechecking error)",
        "descr": "At the join point at the end of two code branches the stacks have inconsistent lengths or contents."
    },
    "unorderedMapLiteral": {
        "title": "Invalid map key order",
        "descr": "Map keys must be in strictly increasing order"
    },
    "unorderedSetLiteral": {
        "title": "Invalid set value order",
        "descr": "Set values must be in strictly increasing order"
    },
    "utils.Timeout": {
        "title": "Timeout",
        "descr": "Timeout"
    },
    "validator.inconsistent_operations_hash": {
        "title": "Invalid merkle tree",
        "descr": "The provided list of operations is inconsistent with the block header."
    },
    "validator.invalid_block": {
        "title": "Invalid block",
        "descr": "Invalid block."
    },
    "validator.missing_test_protocol": {
        "title": "Missing test protocol",
        "descr": "Missing test protocol when forking the test chain"
    },
    "validator.unavailable_protocol": {
        "title": "Missing protocol",
        "descr": "The protocol required for validating a block is missing."
    },
    "worker.closed": {
        "title": "Worker closed",
        "descr": "An operation on a worker could not complete before it was shut down."
    }
}

export function getError(id) {
    let parts = id.split('.')
    let s = parts.slice(2).join('.')
    return errors[s];
}