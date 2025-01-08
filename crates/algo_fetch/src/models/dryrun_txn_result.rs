/*
 * Algod REST API.
 *
 * API endpoint for algod operations.
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: contact@algorand.com
 * Generated by: https://openapi-generator.tech
 */

use crate::models;
use serde::{Deserialize, Serialize};

/// DryrunTxnResult : DryrunTxnResult contains any LogicSig or ApplicationCall program debug information and state updates from a dryrun.
#[derive(Clone, Default, Debug, PartialEq, Serialize, Deserialize)]
pub struct DryrunTxnResult {
    #[serde(rename = "app-call-messages", skip_serializing_if = "Option::is_none")]
    pub app_call_messages: Option<Vec<String>>,
    #[serde(rename = "app-call-trace", skip_serializing_if = "Option::is_none")]
    pub app_call_trace: Option<Vec<models::DryrunState>>,
    /// Budget added during execution of app call transaction.
    #[serde(rename = "budget-added", skip_serializing_if = "Option::is_none")]
    pub budget_added: Option<i32>,
    /// Budget consumed during execution of app call transaction.
    #[serde(rename = "budget-consumed", skip_serializing_if = "Option::is_none")]
    pub budget_consumed: Option<i32>,
    /// Disassembled program line by line.
    #[serde(rename = "disassembly")]
    pub disassembly: Vec<String>,
    /// Application state delta.
    #[serde(rename = "global-delta", skip_serializing_if = "Option::is_none")]
    pub global_delta: Option<Vec<models::EvalDeltaKeyValue>>,
    #[serde(rename = "local-deltas", skip_serializing_if = "Option::is_none")]
    pub local_deltas: Option<Vec<models::AccountStateDelta>>,
    /// Disassembled lsig program line by line.
    #[serde(rename = "logic-sig-disassembly", skip_serializing_if = "Option::is_none")]
    pub logic_sig_disassembly: Option<Vec<String>>,
    #[serde(rename = "logic-sig-messages", skip_serializing_if = "Option::is_none")]
    pub logic_sig_messages: Option<Vec<String>>,
    #[serde(rename = "logic-sig-trace", skip_serializing_if = "Option::is_none")]
    pub logic_sig_trace: Option<Vec<models::DryrunState>>,
    #[serde(rename = "logs", skip_serializing_if = "Option::is_none")]
    pub logs: Option<Vec<String>>,
}

impl DryrunTxnResult {
    /// DryrunTxnResult contains any LogicSig or ApplicationCall program debug information and state updates from a dryrun.
    pub fn new(disassembly: Vec<String>) -> DryrunTxnResult {
        DryrunTxnResult {
            app_call_messages: None,
            app_call_trace: None,
            budget_added: None,
            budget_consumed: None,
            disassembly,
            global_delta: None,
            local_deltas: None,
            logic_sig_disassembly: None,
            logic_sig_messages: None,
            logic_sig_trace: None,
            logs: None,
        }
    }
}
