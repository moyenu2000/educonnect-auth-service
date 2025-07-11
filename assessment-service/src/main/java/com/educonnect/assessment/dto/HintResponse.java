package com.educonnect.assessment.dto;

public class HintResponse {
    private String hint;
    private Integer level;
    private Integer pointsDeducted;

    public HintResponse() {}

    public HintResponse(String hint, Integer level, Integer pointsDeducted) {
        this.hint = hint;
        this.level = level;
        this.pointsDeducted = pointsDeducted;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getPointsDeducted() {
        return pointsDeducted;
    }

    public void setPointsDeducted(Integer pointsDeducted) {
        this.pointsDeducted = pointsDeducted;
    }
}