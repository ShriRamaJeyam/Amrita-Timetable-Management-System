package edu.amrita.timetable;

import java.util.List;

import org.optaplanner.core.api.domain.solution.PlanningEntityCollectionProperty;
import org.optaplanner.core.api.domain.solution.PlanningScore;
import org.optaplanner.core.api.domain.solution.PlanningSolution;
import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;

@PlanningSolution
public class Solver {
	
	@PlanningScore
	private HardSoftScore score;
	@PlanningEntityCollectionProperty
	public List<Lecture> leclst;
	
	public HardSoftScore getScore() {
		return score;
	}

	public void setScore(HardSoftScore score) {
		this.score = score;
	}

	public List<Lecture> getLeclst() {
		return leclst;
	}

	public void setLeclst(List<Lecture> leclst) {
		this.leclst = leclst;
	}
	
}
