export interface EvaluationMetrics {
    precision: number;
    recall: number;
    f1: number;
    auprc: number;
    positive_rate: number;
    predicted_positive_rate: number;
    threshold: number;
    tn: number;
    fp: number;
    fn: number;
    tp: number;
    score_quantiles: number[];
    positive_score_mean: number;
    negative_score_mean: number;
}

export interface RunData {
    seed: number;
    best_epoch: number;
    best_val_ap: number;
    test: {
        at_0_5: EvaluationMetrics;
        at_validation_threshold: EvaluationMetrics;
    };
    dataset_fingerprint: string;
}

export interface AggregateMetrics {
    precision: { mean: number; std: number };
    recall: { mean: number; std: number };
    f1: { mean: number; std: number };
    auprc: { mean: number; std: number };
}

export interface MLPipelineConfig {
    account_scores: string;
    events: string;
    config: {
        red_threshold: number;
        yellow_threshold: number;
        context_min_score: number;
        max_flow_gap_hours: number;
        amount_ratio_low: number;
        amount_ratio_high: number;
        max_paths_per_intermediary: number;
        max_candidate_events: number;
        max_context_accounts: number;
    };
    selected_accounts: number;
    candidate_events: number;
    network_count: number;
    flow_path_count: number;
}

export const ML_RUN_DATA: { runs: RunData[]; aggregate: AggregateMetrics } = {
    runs: [
        {
            seed: 42,
            best_epoch: 5,
            best_val_ap: 0.442098522018242,
            test: {
                at_0_5: {
                    precision: 0.09156357388316151,
                    recall: 0.8487020226150661,
                    f1: 0.1652941267699561,
                    auprc: 0.44043055028365946,
                    positive_rate: 0.020153809612458835,
                    predicted_positive_rate: 0.1868054976023418,
                    threshold: 0.5,
                    tn: 252404,
                    fp: 52871,
                    fn: 950,
                    tp: 5329,
                    score_quantiles: [
                        0.0014678897568956017,
                        0.005683554336428642,
                        0.04802522622048855,
                        0.5921784102916717,
                        0.699774891138074,
                        0.9865555763244629,
                    ],
                    positive_score_mean: 0.647563636302948,
                    negative_score_mean: 0.17731799185276031,
                },
                at_validation_threshold: {
                    precision: 0.8057119871279164,
                    recall: 0.3189998407389712,
                    f1: 0.45704506560182545,
                    auprc: 0.44043055028365946,
                    positive_rate: 0.020153809612458835,
                    predicted_positive_rate: 0.007979355103770134,
                    threshold: 0.7242065072059631,
                    tn: 304792,
                    fp: 483,
                    fn: 4276,
                    tp: 2003,
                    score_quantiles: [
                        0.0014678897568956017,
                        0.005683554336428642,
                        0.04802522622048855,
                        0.5921784102916717,
                        0.699774891138074,
                        0.9865555763244629,
                    ],
                    positive_score_mean: 0.647563636302948,
                    negative_score_mean: 0.17731799185276031,
                },
            },
            dataset_fingerprint: "947cbd14622888f433d4f26a612cb0ed26f7ff627ca89795ef58bd3113aa0e90",
        },
    ],
    aggregate: {
        precision: {
            mean: 0.8057119871279164,
            std: 0.0,
        },
        recall: {
            mean: 0.3189998407389712,
            std: 0.0,
        },
        f1: {
            mean: 0.45704506560182545,
            std: 0.0,
        },
        auprc: {
            mean: 0.44043055028365946,
            std: 0.0,
        },
    },
};

export const STAGE2_CONFIG: MLPipelineConfig = {
    account_scores: "runs\\stage2_chrono_5\\account_scores.parquet",
    events: "data\\processed\\event_stream\\events.parquet",
    config: {
        red_threshold: 0.8,
        yellow_threshold: 0.55,
        context_min_score: 0.15,
        max_flow_gap_hours: 72.0,
        amount_ratio_low: 0.7,
        amount_ratio_high: 1.3,
        max_paths_per_intermediary: 200,
        max_candidate_events: 5000000,
        max_context_accounts: 50000,
    },
    selected_accounts: 50000,
    candidate_events: 266494,
    network_count: 25256,
    flow_path_count: 17621,
};

export const GRAPH_STORE_METRICS = {
    networks_count: 25256,
    nodes_count: 50000,
    edges_count: 75788,
    flow_paths_count: 17621,
    total_evaluated_test_samples: 311554,
};
