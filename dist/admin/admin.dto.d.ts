export declare class CreateMatchDto {
    home_team: string;
    away_team: string;
    match_date: string;
    phase: string;
    group_name?: string;
    stadium_id?: number;
    external_id?: string;
}
export declare class UpdateMatchDto {
    home_team?: string;
    away_team?: string;
    match_date?: string;
    phase?: string;
    group_name?: string;
    stadium_id?: number;
    status?: string;
    external_id?: string;
}
